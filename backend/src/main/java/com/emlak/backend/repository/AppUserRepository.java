package com.emlak.backend.repository;

import com.emlak.backend.domain.entity.AppUser;
import com.emlak.backend.domain.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
    List<AppUser> findByTenantId(Long tenantId);
    List<AppUser> findByTenantIdAndRole(Long tenantId, Role role);
}
