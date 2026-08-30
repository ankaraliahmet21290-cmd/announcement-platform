package com.emlak.backend.repository;

import com.emlak.backend.domain.entity.Property;
import com.emlak.backend.domain.enums.PropertyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    List<Property> findByTenantId(Long tenantId);

    Page<Property> findByTenantId(Long tenantId, Pageable pageable);

    Page<Property> findByTenantIdAndStatus(Long tenantId, PropertyStatus status, Pageable pageable);

    Page<Property> findByTenantIdAndAgentId(Long tenantId, Long agentId, Pageable pageable);

    Optional<Property> findByIdAndTenantId(Long id, Long tenantId);

    long countByTenantId(Long tenantId);

    long countByTenantIdAndStatus(Long tenantId, PropertyStatus status);

    long countByTenantIdAndAgentId(Long tenantId, Long agentId);

    long countByTenantIdAndAgentIdAndStatus(Long tenantId, Long agentId, PropertyStatus status);

    @Query("SELECT p FROM Property p WHERE p.tenant.id = :tenantId AND p.status = 'PUBLISHED' AND p.id != :excludeId AND p.propertyType = :propertyType ORDER BY p.createdAt DESC")
    List<Property> findSimilarProperties(@Param("tenantId") Long tenantId, 
                                         @Param("excludeId") Long excludeId, 
                                         @Param("propertyType") com.emlak.backend.domain.enums.PropertyType propertyType, 
                                         Pageable pageable);

    @Query("SELECT p FROM Property p WHERE p.tenant.id = :tenantId AND p.status = 'PUBLISHED' ORDER BY p.createdAt DESC")
    List<Property> findFeaturedProperties(@Param("tenantId") Long tenantId, Pageable pageable);
}
