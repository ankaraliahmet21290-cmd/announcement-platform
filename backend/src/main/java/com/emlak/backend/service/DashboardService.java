package com.emlak.backend.service;

import com.emlak.backend.domain.entity.Lead;
import com.emlak.backend.domain.entity.Property;
import com.emlak.backend.domain.enums.LeadStatus;
import com.emlak.backend.domain.enums.PropertyStatus;
import com.emlak.backend.domain.enums.Role;
import com.emlak.backend.dto.dashboard.DashboardSummaryResponse;
import com.emlak.backend.dto.lead.LeadResponse;
import com.emlak.backend.dto.property.PropertySummaryResponse;
import com.emlak.backend.dto.tenant.TenantResponse;
import com.emlak.backend.repository.AppUserRepository;
import com.emlak.backend.repository.LeadRepository;
import com.emlak.backend.repository.PropertyRepository;
import com.emlak.backend.repository.TenantRepository;
import com.emlak.backend.security.UserPrincipal;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TenantRepository tenantRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final AppUserRepository appUserRepository;
    private final TenantService tenantService;
    private final PropertyService propertyService;
    private final LeadService leadService;

    public DashboardService(TenantRepository tenantRepository, PropertyRepository propertyRepository, LeadRepository leadRepository, AppUserRepository appUserRepository, TenantService tenantService, PropertyService propertyService, LeadService leadService) {
        this.tenantRepository = tenantRepository;
        this.propertyRepository = propertyRepository;
        this.leadRepository = leadRepository;
        this.appUserRepository = appUserRepository;
        this.tenantService = tenantService;
        this.propertyService = propertyService;
        this.leadService = leadService;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(UserPrincipal principal) {
        Role role = principal.getRole();

        if (role == Role.SUPER_ADMIN) {
            long totalTenants = tenantRepository.count();
            long activeTenants = tenantRepository.findAll().stream()
                    .filter(t -> t.getStatus() == com.emlak.backend.domain.enums.TenantStatus.ACTIVE)
                    .count();
            long totalProperties = propertyRepository.count();
            long totalLeads = leadRepository.count();
            long totalAgents = appUserRepository.count();
            List<TenantResponse> tenants = tenantService.getAllTenants();

            return DashboardSummaryResponse.builder()
                    .role("SUPER_ADMIN")
                    .totalTenants(totalTenants)
                    .activeTenants(activeTenants)
                    .platformTotalProperties(totalProperties)
                    .platformTotalLeads(totalLeads)
                    .platformTotalAgents(totalAgents)
                    .tenantList(tenants)
                    .build();
        }

        Long tenantId = principal.getTenantId();

        if (role == Role.OFFICE_ADMIN) {
            long totalProps = propertyRepository.countByTenantId(tenantId);
            long publishedProps = propertyRepository.countByTenantIdAndStatus(tenantId, PropertyStatus.PUBLISHED);
            long draftProps = propertyRepository.countByTenantIdAndStatus(tenantId, PropertyStatus.DRAFT);
            long passiveProps = propertyRepository.countByTenantIdAndStatus(tenantId, PropertyStatus.PASSIVE);

            long totalLeads = leadRepository.countByTenantId(tenantId);
            long newLeads = leadRepository.countByTenantIdAndStatus(tenantId, LeadStatus.NEW);
            long contactedLeads = leadRepository.countByTenantIdAndStatus(tenantId, LeadStatus.CONTACTED);
            long closedLeads = leadRepository.countByTenantIdAndStatus(tenantId, LeadStatus.CLOSED);

            long totalAgents = appUserRepository.findByTenantId(tenantId).size();

            // Properties by type
            Map<String, Long> propertiesByType = new HashMap<>();
            List<Property> tenantProps = propertyRepository.findByTenantId(tenantId);
            for (Property p : tenantProps) {
                String key = p.getPropertyType().name();
                propertiesByType.put(key, propertiesByType.getOrDefault(key, 0L) + 1);
            }

            // Recent 5 leads
            List<LeadResponse> recentLeads = leadRepository.findTop5ByTenantIdOrderByCreatedAtDesc(tenantId)
                    .stream()
                    .map(leadService::mapToResponse)
                    .collect(Collectors.toList());

            return DashboardSummaryResponse.builder()
                    .role("OFFICE_ADMIN")
                    .totalProperties(totalProps)
                    .publishedProperties(publishedProps)
                    .draftProperties(draftProps)
                    .passiveProperties(passiveProps)
                    .totalLeads(totalLeads)
                    .newLeads(newLeads)
                    .contactedLeads(contactedLeads)
                    .closedLeads(closedLeads)
                    .totalAgents(totalAgents)
                    .propertiesByType(propertiesByType)
                    .recentLeads(recentLeads)
                    .build();
        }

        if (role == Role.AGENT) {
            Long agentId = principal.getId();
            long assignedProps = propertyRepository.countByTenantIdAndAgentId(tenantId, agentId);
            long assignedLeads = leadRepository.countByTenantIdAndAssignedAgentId(tenantId, agentId);
            long newLeads = leadRepository.countByTenantIdAndAssignedAgentIdAndStatus(tenantId, agentId, LeadStatus.NEW);

            List<LeadResponse> myRecentLeads = leadRepository.findByTenantIdAndAssignedAgentId(tenantId, agentId, PageRequest.of(0, 5))
                    .stream()
                    .map(leadService::mapToResponse)
                    .collect(Collectors.toList());

            List<PropertySummaryResponse> myProps = propertyRepository.findByTenantIdAndAgentId(tenantId, agentId, PageRequest.of(0, 10))
                    .stream()
                    .map(propertyService::mapToSummary)
                    .collect(Collectors.toList());

            return DashboardSummaryResponse.builder()
                    .role("AGENT")
                    .myAssignedPropertiesCount(assignedProps)
                    .myAssignedLeadsCount(assignedLeads)
                    .myNewLeadsCount(newLeads)
                    .myRecentLeads(myRecentLeads)
                    .myProperties(myProps)
                    .build();
        }

        return DashboardSummaryResponse.builder().role(role.name()).build();
    }
}
