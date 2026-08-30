package com.emlak.backend.service;

import com.emlak.backend.domain.entity.AppUser;
import com.emlak.backend.domain.entity.Property;
import com.emlak.backend.domain.entity.PropertyImage;
import com.emlak.backend.domain.entity.Tenant;
import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyStatus;
import com.emlak.backend.domain.enums.PropertyType;
import com.emlak.backend.domain.enums.Role;
import com.emlak.backend.dto.property.*;
import com.emlak.backend.repository.AppUserRepository;
import com.emlak.backend.repository.PropertyImageRepository;
import com.emlak.backend.repository.PropertyRepository;
import com.emlak.backend.repository.TenantRepository;
import com.emlak.backend.security.UserPrincipal;
import com.emlak.backend.service.storage.StorageService;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private static final Logger log = LoggerFactory.getLogger(PropertyService.class);

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final TenantRepository tenantRepository;
    private final AppUserRepository appUserRepository;
    private final StorageService storageService;

    public PropertyService(PropertyRepository propertyRepository, PropertyImageRepository propertyImageRepository, TenantRepository tenantRepository, AppUserRepository appUserRepository, StorageService storageService) {
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.tenantRepository = tenantRepository;
        this.appUserRepository = appUserRepository;
        this.storageService = storageService;
    }

    // --- PUBLIC METHODS ---

    @Transactional(readOnly = true)
    public Page<PropertySummaryResponse> getPublicProperties(
            String tenantSlug,
            ListingType listingType,
            PropertyType propertyType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String city,
            String district,
            String roomCount,
            String search,
            Pageable pageable) {

        Tenant tenant = tenantRepository.findBySlug(tenantSlug)
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı: " + tenantSlug));

        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("tenant").get("id"), tenant.getId()));
            predicates.add(cb.equal(root.get("status"), PropertyStatus.PUBLISHED));

            if (listingType != null) {
                predicates.add(cb.equal(root.get("listingType"), listingType));
            }
            if (propertyType != null) {
                predicates.add(cb.equal(root.get("propertyType"), propertyType));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (StringUtils.hasText(city)) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(district)) {
                predicates.add(cb.like(cb.lower(root.get("district")), "%" + district.toLowerCase() + "%"));
            }
            if (StringUtils.hasText(roomCount)) {
                predicates.add(cb.equal(root.get("roomCount"), roomCount));
            }
            if (StringUtils.hasText(search)) {
                String likeTerm = "%" + search.toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), likeTerm);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), likeTerm);
                Predicate neighborhoodMatch = cb.like(cb.lower(root.get("neighborhood")), likeTerm);
                predicates.add(cb.or(titleMatch, descMatch, neighborhoodMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return propertyRepository.findAll(spec, pageable).map(this::mapToSummary);
    }

    @Transactional
    public PropertyResponse getPublicPropertyDetail(String tenantSlug, Long id) {
        Tenant tenant = tenantRepository.findBySlug(tenantSlug)
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı: " + tenantSlug));

        Property property = propertyRepository.findByIdAndTenantId(id, tenant.getId())
                .orElseThrow(() -> new IllegalArgumentException("İlan bulunamadı: " + id));

        property.setViewCount(property.getViewCount() + 1);
        propertyRepository.save(property);

        return mapToDetail(property);
    }

    @Transactional(readOnly = true)
    public List<PropertySummaryResponse> getFeaturedProperties(String tenantSlug, int limit) {
        Tenant tenant = tenantRepository.findBySlug(tenantSlug)
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı: " + tenantSlug));

        Pageable pageable = PageRequest.of(0, limit);
        return propertyRepository.findFeaturedProperties(tenant.getId(), pageable)
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertySummaryResponse> getSimilarProperties(String tenantSlug, Long excludeId, PropertyType propertyType, int limit) {
        Tenant tenant = tenantRepository.findBySlug(tenantSlug)
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı: " + tenantSlug));

        Pageable pageable = PageRequest.of(0, limit);
        return propertyRepository.findSimilarProperties(tenant.getId(), excludeId, propertyType, pageable)
                .stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    // --- ADMIN METHODS ---

    @Transactional(readOnly = true)
    public Page<PropertySummaryResponse> getAdminProperties(UserPrincipal principal, PropertyStatus status, Long agentId, String search, Pageable pageable) {
        Specification<Property> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (principal.getRole() != Role.SUPER_ADMIN) {
                predicates.add(cb.equal(root.get("tenant").get("id"), principal.getTenantId()));
            }

            if (principal.getRole() == Role.AGENT) {
                predicates.add(cb.equal(root.get("agent").get("id"), principal.getId()));
            } else if (agentId != null) {
                predicates.add(cb.equal(root.get("agent").get("id"), agentId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (StringUtils.hasText(search)) {
                String likeTerm = "%" + search.toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), likeTerm);
                Predicate cityMatch = cb.like(cb.lower(root.get("city")), likeTerm);
                Predicate districtMatch = cb.like(cb.lower(root.get("district")), likeTerm);
                predicates.add(cb.or(titleMatch, cityMatch, districtMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return propertyRepository.findAll(spec, pageable).map(this::mapToSummary);
    }

    @Transactional(readOnly = true)
    public PropertyResponse getAdminPropertyById(UserPrincipal principal, Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("İlan bulunamadı: " + id));

        validatePropertyAccess(principal, property);
        return mapToDetail(property);
    }

    @Transactional
    public PropertyResponse createProperty(UserPrincipal principal, PropertyCreateRequest request) {
        Tenant tenant;
        if (principal.getRole() == Role.SUPER_ADMIN) {
            tenant = tenantRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı"));
        } else {
            tenant = tenantRepository.findById(principal.getTenantId())
                    .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı"));
        }

        AppUser agent = null;
        if (principal.getRole() == Role.AGENT) {
            agent = appUserRepository.findById(principal.getId()).orElse(null);
        } else if (request.getAgentId() != null) {
            agent = appUserRepository.findById(request.getAgentId()).orElse(null);
        }

        Property property = Property.builder()
                .tenant(tenant)
                .agent(agent)
                .title(request.getTitle())
                .description(request.getDescription())
                .listingType(request.getListingType())
                .propertyType(request.getPropertyType())
                .price(request.getPrice())
                .currency(StringUtils.hasText(request.getCurrency()) ? request.getCurrency() : "TRY")
                .city(request.getCity())
                .district(request.getDistrict())
                .neighborhood(request.getNeighborhood())
                .grossArea(request.getGrossArea())
                .netArea(request.getNetArea())
                .roomCount(request.getRoomCount())
                .buildingAge(request.getBuildingAge())
                .floor(request.getFloor())
                .totalFloors(request.getTotalFloors())
                .heatingType(request.getHeatingType())
                .deedStatus(request.getDeedStatus())
                .usageStatus(request.getUsageStatus())
                .facade(request.getFacade())
                .suitableForLoan(Boolean.TRUE.equals(request.getSuitableForLoan()))
                .furnished(Boolean.TRUE.equals(request.getFurnished()))
                .hasElevator(Boolean.TRUE.equals(request.getHasElevator()))
                .hasBalcony(Boolean.TRUE.equals(request.getHasBalcony()))
                .hasParking(Boolean.TRUE.equals(request.getHasParking()))
                .inSite(Boolean.TRUE.equals(request.getInSite()))
                .bathroomCount(request.getBathroomCount())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .eidsReference(request.getEidsReference())
                .eidsExpiryDate(request.getEidsExpiryDate())
                .status(request.getStatus() != null ? request.getStatus() : PropertyStatus.DRAFT)
                .viewCount(0L)
                .build();

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            int order = 0;
            for (String url : request.getImageUrls()) {
                PropertyImage image = PropertyImage.builder()
                        .url(url)
                        .sortOrder(order++)
                        .build();
                property.addImage(image);
            }
        }

        property = propertyRepository.save(property);
        return mapToDetail(property);
    }

    @Transactional
    public PropertyResponse updateProperty(UserPrincipal principal, Long id, PropertyUpdateRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("İlan bulunamadı: " + id));

        validatePropertyAccess(principal, property);

        if (request.getTitle() != null) property.setTitle(request.getTitle());
        if (request.getDescription() != null) property.setDescription(request.getDescription());
        if (request.getListingType() != null) property.setListingType(request.getListingType());
        if (request.getPropertyType() != null) property.setPropertyType(request.getPropertyType());
        if (request.getPrice() != null) property.setPrice(request.getPrice());
        if (request.getCurrency() != null) property.setCurrency(request.getCurrency());
        if (request.getCity() != null) property.setCity(request.getCity());
        if (request.getDistrict() != null) property.setDistrict(request.getDistrict());
        if (request.getNeighborhood() != null) property.setNeighborhood(request.getNeighborhood());
        if (request.getGrossArea() != null) property.setGrossArea(request.getGrossArea());
        if (request.getNetArea() != null) property.setNetArea(request.getNetArea());
        if (request.getRoomCount() != null) property.setRoomCount(request.getRoomCount());
        if (request.getBuildingAge() != null) property.setBuildingAge(request.getBuildingAge());
        if (request.getFloor() != null) property.setFloor(request.getFloor());
        if (request.getTotalFloors() != null) property.setTotalFloors(request.getTotalFloors());
        if (request.getHeatingType() != null) property.setHeatingType(request.getHeatingType());
        if (request.getDeedStatus() != null) property.setDeedStatus(request.getDeedStatus());
        if (request.getUsageStatus() != null) property.setUsageStatus(request.getUsageStatus());
        if (request.getFacade() != null) property.setFacade(request.getFacade());
        if (request.getSuitableForLoan() != null) property.setSuitableForLoan(request.getSuitableForLoan());
        if (request.getFurnished() != null) property.setFurnished(request.getFurnished());
        if (request.getHasElevator() != null) property.setHasElevator(request.getHasElevator());
        if (request.getHasBalcony() != null) property.setHasBalcony(request.getHasBalcony());
        if (request.getHasParking() != null) property.setHasParking(request.getHasParking());
        if (request.getInSite() != null) property.setInSite(request.getInSite());
        if (request.getBathroomCount() != null) property.setBathroomCount(request.getBathroomCount());
        if (request.getLatitude() != null) property.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) property.setLongitude(request.getLongitude());
        if (request.getEidsReference() != null) property.setEidsReference(request.getEidsReference());
        if (request.getEidsExpiryDate() != null) property.setEidsExpiryDate(request.getEidsExpiryDate());
        if (request.getStatus() != null) property.setStatus(request.getStatus());

        if (principal.getRole() != Role.AGENT && request.getAgentId() != null) {
            AppUser agent = appUserRepository.findById(request.getAgentId()).orElse(null);
            property.setAgent(agent);
        }

        property = propertyRepository.save(property);
        return mapToDetail(property);
    }

    @Transactional
    public void deleteProperty(UserPrincipal principal, Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("İlan bulunamadı: " + id));

        if (principal.getRole() != Role.SUPER_ADMIN && principal.getRole() != Role.OFFICE_ADMIN) {
            throw new AccessDeniedException("İlan silme yetkiniz bulunmamaktadır");
        }
        if (principal.getRole() == Role.OFFICE_ADMIN && !property.getTenant().getId().equals(principal.getTenantId())) {
            throw new AccessDeniedException("Farklı bir ofisin ilanını silemezsiniz");
        }

        propertyRepository.delete(property);
    }

    @Transactional
    public PropertyImageDto addImage(UserPrincipal principal, Long propertyId, MultipartFile file) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("İlan bulunamadı: " + propertyId));

        validatePropertyAccess(principal, property);

        String fileUrl = storageService.storeFile(file);
        int nextOrder = property.getImages().size();

        PropertyImage image = PropertyImage.builder()
                .url(fileUrl)
                .sortOrder(nextOrder)
                .build();

        property.addImage(image);
        propertyRepository.save(property);

        return PropertyImageDto.builder()
                .id(image.getId())
                .url(image.getUrl())
                .sortOrder(image.getSortOrder())
                .build();
    }

    @Transactional
    public void deleteImage(UserPrincipal principal, Long propertyId, Long imageId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new IllegalArgumentException("İlan bulunamadı: " + propertyId));

        validatePropertyAccess(principal, property);

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Görsel bulunamadı: " + imageId));

        if (!image.getProperty().getId().equals(property.getId())) {
            throw new IllegalArgumentException("Görsel bu ilana ait değil");
        }

        storageService.deleteFile(image.getUrl());
        property.removeImage(image);
        propertyRepository.save(property);
    }

    // --- HELPER & MAPPING ---

    private void validatePropertyAccess(UserPrincipal principal, Property property) {
        if (principal.getRole() == Role.SUPER_ADMIN) {
            return;
        }
        if (!property.getTenant().getId().equals(principal.getTenantId())) {
            throw new AccessDeniedException("Bu ilana erişim yetkiniz yok");
        }
        if (principal.getRole() == Role.AGENT && (property.getAgent() == null || !property.getAgent().getId().equals(principal.getId()))) {
            throw new AccessDeniedException("Sadece size atanan ilanları yönetebilirsiniz");
        }
    }

    public PropertySummaryResponse mapToSummary(Property p) {
        String cover = p.getImages().isEmpty() ? null : p.getImages().get(0).getUrl();

        return PropertySummaryResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .listingType(p.getListingType())
                .propertyType(p.getPropertyType())
                .price(p.getPrice())
                .currency(p.getCurrency())
                .city(p.getCity())
                .district(p.getDistrict())
                .neighborhood(p.getNeighborhood())
                .grossArea(p.getGrossArea())
                .netArea(p.getNetArea())
                .roomCount(p.getRoomCount())
                .status(p.getStatus())
                .viewCount(p.getViewCount())
                .coverImage(cover)
                .agentId(p.getAgent() != null ? p.getAgent().getId() : null)
                .agentName(p.getAgent() != null ? p.getAgent().getFullName() : null)
                .createdAt(p.getCreatedAt())
                .build();
    }

    public PropertyResponse mapToDetail(Property p) {
        List<PropertyImageDto> imageDtos = p.getImages().stream()
                .map(img -> PropertyImageDto.builder()
                        .id(img.getId())
                        .url(img.getUrl())
                        .sortOrder(img.getSortOrder())
                        .build())
                .collect(Collectors.toList());

        String cover = imageDtos.isEmpty() ? null : imageDtos.get(0).getUrl();

        return PropertyResponse.builder()
                .id(p.getId())
                .tenantId(p.getTenant().getId())
                .tenantName(p.getTenant().getName())
                .tenantSlug(p.getTenant().getSlug())
                .tenantPhone(p.getTenant().getPhone())
                .tenantWhatsapp(p.getTenant().getWhatsapp())
                .agentId(p.getAgent() != null ? p.getAgent().getId() : null)
                .agentName(p.getAgent() != null ? p.getAgent().getFullName() : null)
                .agentEmail(p.getAgent() != null ? p.getAgent().getEmail() : null)
                .agentPhone(p.getAgent() != null ? p.getAgent().getPhone() : null)
                .agentWhatsapp(p.getAgent() != null ? p.getAgent().getWhatsapp() : null)
                .agentPhotoUrl(p.getAgent() != null ? p.getAgent().getPhotoUrl() : null)
                .title(p.getTitle())
                .description(p.getDescription())
                .listingType(p.getListingType())
                .propertyType(p.getPropertyType())
                .price(p.getPrice())
                .currency(p.getCurrency())
                .city(p.getCity())
                .district(p.getDistrict())
                .neighborhood(p.getNeighborhood())
                .grossArea(p.getGrossArea())
                .netArea(p.getNetArea())
                .roomCount(p.getRoomCount())
                .buildingAge(p.getBuildingAge())
                .floor(p.getFloor())
                .totalFloors(p.getTotalFloors())
                .heatingType(p.getHeatingType())
                .deedStatus(p.getDeedStatus())
                .usageStatus(p.getUsageStatus())
                .facade(p.getFacade())
                .suitableForLoan(p.isSuitableForLoan())
                .furnished(p.isFurnished())
                .hasElevator(p.isHasElevator())
                .hasBalcony(p.isHasBalcony())
                .hasParking(p.isHasParking())
                .inSite(p.isInSite())
                .bathroomCount(p.getBathroomCount())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .eidsReference(p.getEidsReference())
                .eidsExpiryDate(p.getEidsExpiryDate())
                .status(p.getStatus())
                .viewCount(p.getViewCount())
                .images(imageDtos)
                .coverImage(cover)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
