package com.emlak.backend.service;

import com.emlak.backend.domain.entity.AppUser;
import com.emlak.backend.domain.entity.Tenant;
import com.emlak.backend.domain.enums.Role;
import com.emlak.backend.domain.enums.TenantStatus;
import com.emlak.backend.dto.tenant.TenantCreateRequest;
import com.emlak.backend.dto.tenant.TenantResponse;
import com.emlak.backend.dto.tenant.TenantUpdateRequest;
import com.emlak.backend.repository.AppUserRepository;
import com.emlak.backend.repository.LeadRepository;
import com.emlak.backend.repository.PropertyRepository;
import com.emlak.backend.repository.TenantRepository;
import com.emlak.backend.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;
    private final AppUserRepository appUserRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final PasswordEncoder passwordEncoder;

    public TenantService(TenantRepository tenantRepository, AppUserRepository appUserRepository, PropertyRepository propertyRepository, LeadRepository leadRepository, PasswordEncoder passwordEncoder) {
        this.tenantRepository = tenantRepository;
        this.appUserRepository = appUserRepository;
        this.propertyRepository = propertyRepository;
        this.leadRepository = leadRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Tenant getTenantBySlug(String slug) {
        return tenantRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı: " + slug));
    }

    @Transactional(readOnly = true)
    public TenantResponse getTenantResponseBySlug(String slug) {
        Tenant tenant = getTenantBySlug(slug);
        return mapToResponse(tenant);
    }

    @Transactional(readOnly = true)
    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TenantResponse createTenant(TenantCreateRequest request) {
        if (tenantRepository.existsBySlug(request.getSlug())) {
            throw new IllegalArgumentException("Bu slug zaten kullanımda: " + request.getSlug());
        }
        if (appUserRepository.existsByEmail(request.getAdminEmail())) {
            throw new IllegalArgumentException("Bu email zaten kayıtlı: " + request.getAdminEmail());
        }

        Tenant tenant = Tenant.builder()
                .name(request.getName())
                .slug(request.getSlug().toLowerCase().trim())
                .phone(request.getPhone())
                .whatsapp(request.getWhatsapp())
                .email(request.getEmail())
                .address(request.getAddress())
                .logoUrl(request.getLogoUrl())
                .aboutText(request.getAboutText())
                .status(TenantStatus.ACTIVE)
                .planName("TRIAL") // TODO: Faz 2 / Faz 3 billing
                .build();

        tenant = tenantRepository.save(tenant);

        // İlk Office Admin kullanıcısını oluştur
        AppUser officeAdmin = AppUser.builder()
                .tenant(tenant)
                .fullName(request.getAdminFullName())
                .email(request.getAdminEmail())
                .password(passwordEncoder.encode(request.getAdminPassword()))
                .phone(request.getAdminPhone())
                .whatsapp(request.getAdminPhone())
                .role(Role.OFFICE_ADMIN)
                .active(true)
                .build();

        appUserRepository.save(officeAdmin);

        return mapToResponse(tenant);
    }

    @Transactional
    public TenantResponse updateTenantStatus(Long id, TenantStatus status) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı: " + id));

        tenant.setStatus(status);
        tenant = tenantRepository.save(tenant);
        return mapToResponse(tenant);
    }

    @Transactional(readOnly = true)
    public TenantResponse getMyTenant(UserPrincipal principal) {
        if (principal.getTenantId() == null) {
            throw new IllegalArgumentException("Kullanıcının tenant bilgisi bulunamadı");
        }
        Tenant tenant = tenantRepository.findById(principal.getTenantId())
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı"));
        return mapToResponse(tenant);
    }

    @Transactional
    public TenantResponse updateMyTenant(UserPrincipal principal, TenantUpdateRequest request) {
        if (principal.getTenantId() == null) {
            throw new IllegalArgumentException("Kullanıcının tenant bilgisi bulunamadı");
        }
        Tenant tenant = tenantRepository.findById(principal.getTenantId())
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı"));

        if (request.getName() != null) tenant.setName(request.getName());
        if (request.getPhone() != null) tenant.setPhone(request.getPhone());
        if (request.getWhatsapp() != null) tenant.setWhatsapp(request.getWhatsapp());
        if (request.getEmail() != null) tenant.setEmail(request.getEmail());
        if (request.getAddress() != null) tenant.setAddress(request.getAddress());
        if (request.getLogoUrl() != null) tenant.setLogoUrl(request.getLogoUrl());
        if (request.getAboutText() != null) tenant.setAboutText(request.getAboutText());
        if (request.getCustomDomain() != null) tenant.setCustomDomain(request.getCustomDomain()); // TODO: Faz 2 custom domain

        tenant = tenantRepository.save(tenant);
        return mapToResponse(tenant);
    }

    private TenantResponse mapToResponse(Tenant tenant) {
        long propertyCount = propertyRepository.countByTenantId(tenant.getId());
        long leadCount = leadRepository.countByTenantId(tenant.getId());
        long agentCount = appUserRepository.findByTenantId(tenant.getId()).size();

        return TenantResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .slug(tenant.getSlug())
                .customDomain(tenant.getCustomDomain())
                .phone(tenant.getPhone())
                .whatsapp(tenant.getWhatsapp())
                .email(tenant.getEmail())
                .address(tenant.getAddress())
                .logoUrl(tenant.getLogoUrl())
                .aboutText(tenant.getAboutText())
                .status(tenant.getStatus())
                .planName(tenant.getPlanName())
                .totalProperties(propertyCount)
                .totalLeads(leadCount)
                .totalAgents(agentCount)
                .createdAt(tenant.getCreatedAt())
                .build();
    }
}
