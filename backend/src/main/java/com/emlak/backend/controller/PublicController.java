package com.emlak.backend.controller;

import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyType;
import com.emlak.backend.dto.lead.LeadResponse;
import com.emlak.backend.dto.lead.PublicLeadCreateRequest;
import com.emlak.backend.dto.property.PropertyResponse;
import com.emlak.backend.dto.property.PropertySummaryResponse;
import com.emlak.backend.dto.tenant.TenantResponse;
import com.emlak.backend.service.LeadService;
import com.emlak.backend.service.PropertyService;
import com.emlak.backend.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final PropertyService propertyService;
    private final LeadService leadService;
    private final TenantService tenantService;

    public PublicController(PropertyService propertyService, LeadService leadService, TenantService tenantService) {
        this.propertyService = propertyService;
        this.leadService = leadService;
        this.tenantService = tenantService;
    }

    private String resolveTenantSlug(String headerSlug, String paramSlug) {
        if (StringUtils.hasText(headerSlug)) {
            return headerSlug.trim();
        }
        if (StringUtils.hasText(paramSlug)) {
            return paramSlug.trim();
        }
        return "korkmaz";
    }

    @GetMapping("/tenant")
    public ResponseEntity<TenantResponse> getTenantInfo(
            @RequestHeader(value = "X-Tenant-Slug", required = false) String headerSlug,
            @RequestParam(value = "slug", required = false) String paramSlug) {
        String slug = resolveTenantSlug(headerSlug, paramSlug);
        return ResponseEntity.ok(tenantService.getTenantResponseBySlug(slug));
    }

    @GetMapping("/properties")
    public ResponseEntity<Page<PropertySummaryResponse>> getProperties(
            @RequestHeader(value = "X-Tenant-Slug", required = false) String headerSlug,
            @RequestParam(value = "slug", required = false) String paramSlug,
            @RequestParam(value = "listingType", required = false) ListingType listingType,
            @RequestParam(value = "propertyType", required = false) List<PropertyType> propertyTypes,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "minArea", required = false) Integer minArea,
            @RequestParam(value = "maxArea", required = false) Integer maxArea,
            @RequestParam(value = "minNetArea", required = false) Integer minNetArea,
            @RequestParam(value = "maxNetArea", required = false) Integer maxNetArea,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "district", required = false) String district,
            @RequestParam(value = "neighborhood", required = false) String neighborhood,
            @RequestParam(value = "roomCount", required = false) List<String> roomCounts,
            @RequestParam(value = "buildingAge", required = false) List<String> buildingAges,
            @RequestParam(value = "floor", required = false) List<String> floors,
            @RequestParam(value = "totalFloor", required = false) List<String> totalFloors,
            @RequestParam(value = "heatingType", required = false) List<String> heatingTypes,
            @RequestParam(value = "deedStatus", required = false) List<String> deedStatuses,
            @RequestParam(value = "usageStatus", required = false) List<String> usageStatuses,
            @RequestParam(value = "bathroomCount", required = false) List<Integer> bathroomCounts,
            @RequestParam(value = "suitableForLoan", required = false) Boolean suitableForLoan,
            @RequestParam(value = "furnished", required = false) Boolean furnished,
            @RequestParam(value = "hasElevator", required = false) Boolean hasElevator,
            @RequestParam(value = "hasBalcony", required = false) Boolean hasBalcony,
            @RequestParam(value = "hasParking", required = false) Boolean hasParking,
            @RequestParam(value = "inSite", required = false) Boolean inSite,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir) {

        String slug = resolveTenantSlug(headerSlug, paramSlug);
        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(propertyService.getPublicProperties(
                slug, listingType, propertyTypes, minPrice, maxPrice, minArea, maxArea,
                minNetArea, maxNetArea, city, district, neighborhood, roomCounts, buildingAges,
                floors, totalFloors, heatingTypes, deedStatuses, usageStatuses, bathroomCounts,
                suitableForLoan, furnished, hasElevator, hasBalcony, hasParking, inSite,
                search, pageable
        ));
    }

    @GetMapping("/properties/featured")
    public ResponseEntity<List<PropertySummaryResponse>> getFeaturedProperties(
            @RequestHeader(value = "X-Tenant-Slug", required = false) String headerSlug,
            @RequestParam(value = "slug", required = false) String paramSlug,
            @RequestParam(value = "limit", defaultValue = "6") int limit) {

        String slug = resolveTenantSlug(headerSlug, paramSlug);
        return ResponseEntity.ok(propertyService.getFeaturedProperties(slug, limit));
    }

    @GetMapping("/properties/{id}")
    public ResponseEntity<PropertyResponse> getPropertyDetail(
            @RequestHeader(value = "X-Tenant-Slug", required = false) String headerSlug,
            @RequestParam(value = "slug", required = false) String paramSlug,
            @PathVariable Long id) {

        String slug = resolveTenantSlug(headerSlug, paramSlug);
        return ResponseEntity.ok(propertyService.getPublicPropertyDetail(slug, id));
    }

    @GetMapping("/properties/{id}/similar")
    public ResponseEntity<List<PropertySummaryResponse>> getSimilarProperties(
            @RequestHeader(value = "X-Tenant-Slug", required = false) String headerSlug,
            @RequestParam(value = "slug", required = false) String paramSlug,
            @PathVariable Long id,
            @RequestParam(value = "propertyType", defaultValue = "RESIDENCE") PropertyType propertyType,
            @RequestParam(value = "limit", defaultValue = "4") int limit) {

        String slug = resolveTenantSlug(headerSlug, paramSlug);
        return ResponseEntity.ok(propertyService.getSimilarProperties(slug, id, propertyType, limit));
    }

    @PostMapping("/leads")
    public ResponseEntity<LeadResponse> createLead(
            @RequestHeader(value = "X-Tenant-Slug", required = false) String headerSlug,
            @RequestParam(value = "slug", required = false) String paramSlug,
            @Valid @RequestBody PublicLeadCreateRequest request) {

        String slug = resolveTenantSlug(headerSlug, paramSlug);
        return ResponseEntity.ok(leadService.createPublicLead(slug, request));
    }
}
