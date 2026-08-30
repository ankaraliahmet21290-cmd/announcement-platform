package com.emlak.backend.service;

import com.emlak.backend.domain.entity.AppUser;
import com.emlak.backend.domain.entity.Tenant;
import com.emlak.backend.domain.enums.Role;
import com.emlak.backend.dto.agent.AgentCreateRequest;
import com.emlak.backend.dto.agent.AgentResponse;
import com.emlak.backend.repository.AppUserRepository;
import com.emlak.backend.repository.LeadRepository;
import com.emlak.backend.repository.PropertyRepository;
import com.emlak.backend.repository.TenantRepository;
import com.emlak.backend.security.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentService {

    private final AppUserRepository appUserRepository;
    private final TenantRepository tenantRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final PasswordEncoder passwordEncoder;

    public AgentService(AppUserRepository appUserRepository, TenantRepository tenantRepository, PropertyRepository propertyRepository, LeadRepository leadRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.tenantRepository = tenantRepository;
        this.propertyRepository = propertyRepository;
        this.leadRepository = leadRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AgentResponse> getAgents(UserPrincipal principal) {
        Long tenantId = principal.getTenantId();
        if (tenantId == null) {
            throw new IllegalArgumentException("Tenant bilgisi bulunamadı");
        }

        List<AppUser> agents = appUserRepository.findByTenantId(tenantId);
        return agents.stream()
                .filter(u -> u.getRole() == Role.AGENT || u.getRole() == Role.OFFICE_ADMIN)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AgentResponse createAgent(UserPrincipal principal, AgentCreateRequest request) {
        if (principal.getRole() != Role.OFFICE_ADMIN && principal.getRole() != Role.SUPER_ADMIN) {
            throw new AccessDeniedException("Danışman ekleme yetkiniz yok");
        }

        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Bu email zaten kayıtlı: " + request.getEmail());
        }

        Tenant tenant = tenantRepository.findById(principal.getTenantId())
                .orElseThrow(() -> new IllegalArgumentException("Tenant bulunamadı"));

        AppUser agent = AppUser.builder()
                .tenant(tenant)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .whatsapp(request.getWhatsapp())
                .photoUrl(request.getPhotoUrl())
                .role(Role.AGENT)
                .active(true)
                .build();

        agent = appUserRepository.save(agent);
        return mapToResponse(agent);
    }

    @Transactional
    public AgentResponse toggleAgentActive(UserPrincipal principal, Long agentId) {
        if (principal.getRole() != Role.OFFICE_ADMIN && principal.getRole() != Role.SUPER_ADMIN) {
            throw new AccessDeniedException("Yetkiniz yok");
        }

        AppUser agent = appUserRepository.findById(agentId)
                .orElseThrow(() -> new IllegalArgumentException("Danışman bulunamadı: " + agentId));

        if (principal.getRole() == Role.OFFICE_ADMIN && !agent.getTenant().getId().equals(principal.getTenantId())) {
            throw new AccessDeniedException("Farklı bir ofisin danışmanını düzenleyemezsiniz");
        }

        agent.setActive(!agent.isActive());
        agent = appUserRepository.save(agent);
        return mapToResponse(agent);
    }

    private AgentResponse mapToResponse(AppUser user) {
        long propCount = 0;
        long leadCount = 0;
        if (user.getTenant() != null) {
            propCount = propertyRepository.countByTenantIdAndAgentId(user.getTenant().getId(), user.getId());
            leadCount = leadRepository.countByTenantIdAndAssignedAgentId(user.getTenant().getId(), user.getId());
        }

        return AgentResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .whatsapp(user.getWhatsapp())
                .role(user.getRole())
                .photoUrl(user.getPhotoUrl())
                .active(user.isActive())
                .assignedPropertiesCount(propCount)
                .assignedLeadsCount(leadCount)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
