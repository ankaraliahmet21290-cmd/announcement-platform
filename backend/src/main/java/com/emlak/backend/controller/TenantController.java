package com.emlak.backend.controller;

import com.emlak.backend.domain.enums.TenantStatus;
import com.emlak.backend.dto.tenant.TenantCreateRequest;
import com.emlak.backend.dto.tenant.TenantResponse;
import com.emlak.backend.dto.tenant.TenantUpdateRequest;
import com.emlak.backend.security.UserPrincipal;
import com.emlak.backend.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tenants")
public class TenantController {

    private final TenantService tenantService;

    public TenantController(TenantService tenantService) {
        this.tenantService = tenantService;
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<TenantResponse>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantResponse> createTenant(@Valid @RequestBody TenantCreateRequest request) {
        return ResponseEntity.ok(tenantService.createTenant(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<TenantResponse> updateTenantStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        TenantStatus status = TenantStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(tenantService.updateTenantStatus(id, status));
    }

    @GetMapping("/settings")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN')")
    public ResponseEntity<TenantResponse> getMyTenantSettings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(tenantService.getMyTenant(principal));
    }

    @PutMapping("/settings")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN')")
    public ResponseEntity<TenantResponse> updateMyTenantSettings(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody TenantUpdateRequest request) {
        return ResponseEntity.ok(tenantService.updateMyTenant(principal, request));
    }
}
