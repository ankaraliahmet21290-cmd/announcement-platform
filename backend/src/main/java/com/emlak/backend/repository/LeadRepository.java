package com.emlak.backend.repository;

import com.emlak.backend.domain.entity.Lead;
import com.emlak.backend.domain.enums.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long>, JpaSpecificationExecutor<Lead> {

    List<Lead> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    Page<Lead> findByTenantId(Long tenantId, Pageable pageable);

    Page<Lead> findByTenantIdAndStatus(Long tenantId, LeadStatus status, Pageable pageable);

    Page<Lead> findByTenantIdAndAssignedAgentId(Long tenantId, Long agentId, Pageable pageable);

    Optional<Lead> findByIdAndTenantId(Long id, Long tenantId);

    long countByTenantId(Long tenantId);

    long countByTenantIdAndStatus(Long tenantId, LeadStatus status);

    long countByTenantIdAndAssignedAgentId(Long tenantId, Long agentId);

    long countByTenantIdAndAssignedAgentIdAndStatus(Long tenantId, Long agentId, LeadStatus status);

    List<Lead> findTop5ByTenantIdOrderByCreatedAtDesc(Long tenantId);
}
