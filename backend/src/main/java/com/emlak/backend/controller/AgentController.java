package com.emlak.backend.controller;

import com.emlak.backend.dto.agent.AgentCreateRequest;
import com.emlak.backend.dto.agent.AgentResponse;
import com.emlak.backend.security.UserPrincipal;
import com.emlak.backend.service.AgentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN')")
    public ResponseEntity<List<AgentResponse>> getAgents(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(agentService.getAgents(principal));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN')")
    public ResponseEntity<AgentResponse> createAgent(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AgentCreateRequest request) {
        return ResponseEntity.ok(agentService.createAgent(principal, request));
    }

    @PatchMapping("/{id}/active")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN')")
    public ResponseEntity<AgentResponse> toggleAgentActive(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(agentService.toggleAgentActive(principal, id));
    }
}
