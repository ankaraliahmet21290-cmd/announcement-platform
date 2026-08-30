package com.emlak.backend.controller;

import com.emlak.backend.domain.enums.LeadStatus;
import com.emlak.backend.dto.lead.LeadResponse;
import com.emlak.backend.dto.lead.LeadUpdateRequest;
import com.emlak.backend.security.UserPrincipal;
import com.emlak.backend.service.LeadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT')")
    public ResponseEntity<Page<LeadResponse>> getLeads(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(value = "status", required = false) LeadStatus status,
            @RequestParam(value = "agentId", required = false) Long agentId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "15") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(leadService.getLeads(principal, status, agentId, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT')")
    public ResponseEntity<LeadResponse> getLeadById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(principal, id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT')")
    public ResponseEntity<LeadResponse> updateLead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody LeadUpdateRequest request) {
        return ResponseEntity.ok(leadService.updateLead(principal, id, request));
    }
}
