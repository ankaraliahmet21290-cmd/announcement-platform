package com.emlak.backend.dto.lead;

import com.emlak.backend.domain.enums.LeadStatus;

public class LeadUpdateRequest {
    private LeadStatus status;
    private Long assignedAgentId;
    private String notes;

    public LeadUpdateRequest() {}

    public LeadUpdateRequest(LeadStatus status, Long assignedAgentId, String notes) {
        this.status = status;
        this.assignedAgentId = assignedAgentId;
        this.notes = notes;
    }

    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }

    public Long getAssignedAgentId() { return assignedAgentId; }
    public void setAssignedAgentId(Long assignedAgentId) { this.assignedAgentId = assignedAgentId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
