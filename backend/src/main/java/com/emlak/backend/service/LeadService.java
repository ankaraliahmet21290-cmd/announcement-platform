package com.emlak.backend.service;

import com.emlak.backend.domain.entity.AppUser;
import com.emlak.backend.domain.entity.Lead;
import com.emlak.backend.domain.entity.Property;
import com.emlak.backend.domain.entity.Tenant;
import com.emlak.backend.domain.enums.LeadSource;
import com.emlak.backend.domain.enums.LeadStatus;
import com.emlak.backend.domain.enums.Role;
import com.emlak.backend.dto.lead.LeadResponse;
import com.emlak.backend.dto.lead.LeadUpdateRequest;
import com.emlak.backend.dto.lead.PublicLeadCreateRequest;
import com.emlak.backend.repository.AppUserRepository;
import com.emlak.backend.repository.LeadRepository;
import com.emlak.backend.repository.PropertyRepository;
import com.emlak.backend.repository.TenantRepository;
import com.emlak.backend.security.UserPrincipal;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class LeadService {

    private static final Logger log = LoggerFactory.getLogger(LeadService.class);

    private final LeadRepository leadRepository;
    private final TenantRepository tenantRepository;
    private final PropertyRepository propertyRepository;
    private final AppUserRepository appUserRepository;

    public LeadService(LeadRepository leadRepository, TenantRepository tenantRepository, PropertyRepository propertyRepository, AppUserRepository appUserRepository) {
        this.leadRepository = leadRepository;
        this.tenantRepository = tenantRepository;
        this.propertyRepository = propertyRepository;
        this.appUserRepository = appUserRepository;
    }

    // --- PUBLIC ---

    @Transactional
    public LeadResponse createPublicLead(String tenantSlug, PublicLeadCreateRequest request) {
        Tenant tenant = tenantRepository.findBySlug(tenantSlug)
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı: " + tenantSlug));

        Property property = null;
        AppUser assignedAgent = null;

        if (request.getPropertyId() != null) {
            property = propertyRepository.findByIdAndTenantId(request.getPropertyId(), tenant.getId())
                    .orElse(null);
            if (property != null && property.getAgent() != null) {
                assignedAgent = property.getAgent();
            }
        }

        Lead lead = Lead.builder()
                .tenant(tenant)
                .property(property)
                .assignedAgent(assignedAgent)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .message(request.getMessage())
                .requestType(request.getRequestType())
                .category(request.getCategory())
                .source(LeadSource.WEB_FORM)
                .status(LeadStatus.NEW)
                .kvkkConsent(request.isKvkkConsent())
                .build();

        lead = leadRepository.save(lead);

        // TODO: WhatsApp notification (Faz 2: Lead geldiğinde atanmış danışmana veya ofis yöneticisine WhatsApp mesajı gönderilecek)
        log.info("Yeni talep oluşturuldu. ID: {}, Tenant: {}, İsim: {}, Telefon: {}", lead.getId(), tenant.getSlug(), lead.getFullName(), lead.getPhone());

        return mapToResponse(lead);
    }

    // --- ADMIN ---

    @Transactional(readOnly = true)
    public Page<LeadResponse> getLeads(UserPrincipal principal, LeadStatus status, Long agentId, Pageable pageable) {
        Specification<Lead> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (principal.getRole() != Role.SUPER_ADMIN) {
                predicates.add(cb.equal(root.get("tenant").get("id"), principal.getTenantId()));
            }

            if (principal.getRole() == Role.AGENT) {
                predicates.add(cb.equal(root.get("assignedAgent").get("id"), principal.getId()));
            } else if (agentId != null) {
                predicates.add(cb.equal(root.get("assignedAgent").get("id"), agentId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return leadRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public LeadResponse getLeadById(UserPrincipal principal, Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Talep bulunamadı: " + id));

        validateLeadAccess(principal, lead);
        return mapToResponse(lead);
    }

    @Transactional
    public LeadResponse updateLead(UserPrincipal principal, Long id, LeadUpdateRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Talep bulunamadı: " + id));

        validateLeadAccess(principal, lead);

        if (request.getStatus() != null) {
            lead.setStatus(request.getStatus());
        }

        if (request.getNotes() != null) {
            lead.setNotes(request.getNotes());
        }

        if (principal.getRole() != Role.AGENT && request.getAssignedAgentId() != null) {
            AppUser agent = appUserRepository.findById(request.getAssignedAgentId())
                    .orElse(null);
            lead.setAssignedAgent(agent);
        }

        lead = leadRepository.save(lead);
        return mapToResponse(lead);
    }

    private void validateLeadAccess(UserPrincipal principal, Lead lead) {
        if (principal.getRole() == Role.SUPER_ADMIN) {
            return;
        }
        if (!lead.getTenant().getId().equals(principal.getTenantId())) {
            throw new AccessDeniedException("Bu talebe erişim yetkiniz yok");
        }
        if (principal.getRole() == Role.AGENT && (lead.getAssignedAgent() == null || !lead.getAssignedAgent().getId().equals(principal.getId()))) {
            throw new AccessDeniedException("Sadece size atanan talepleri yönetebilirsiniz");
        }
    }

    public LeadResponse mapToResponse(Lead lead) {
        return LeadResponse.builder()
                .id(lead.getId())
                .tenantId(lead.getTenant().getId())
                .propertyId(lead.getProperty() != null ? lead.getProperty().getId() : null)
                .propertyTitle(lead.getProperty() != null ? lead.getProperty().getTitle() : null)
                .assignedAgentId(lead.getAssignedAgent() != null ? lead.getAssignedAgent().getId() : null)
                .assignedAgentName(lead.getAssignedAgent() != null ? lead.getAssignedAgent().getFullName() : null)
                .fullName(lead.getFullName())
                .phone(lead.getPhone())
                .email(lead.getEmail())
                .message(lead.getMessage())
                .requestType(lead.getRequestType())
                .category(lead.getCategory())
                .source(lead.getSource())
                .status(lead.getStatus())
                .kvkkConsent(lead.isKvkkConsent())
                .notes(lead.getNotes())
                .createdAt(lead.getCreatedAt())
                .updatedAt(lead.getUpdatedAt())
                .build();
    }
}
