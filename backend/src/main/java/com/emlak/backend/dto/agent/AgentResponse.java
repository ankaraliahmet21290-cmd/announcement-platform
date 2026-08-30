package com.emlak.backend.dto.agent;

import com.emlak.backend.domain.enums.Role;

import java.time.LocalDateTime;

public class AgentResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String whatsapp;
    private Role role;
    private String photoUrl;
    private boolean active;
    private long assignedPropertiesCount;
    private long assignedLeadsCount;
    private LocalDateTime createdAt;

    public AgentResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final AgentResponse r = new AgentResponse();

        public Builder id(Long id) { r.id = id; return this; }
        public Builder fullName(String fullName) { r.fullName = fullName; return this; }
        public Builder email(String email) { r.email = email; return this; }
        public Builder phone(String phone) { r.phone = phone; return this; }
        public Builder whatsapp(String whatsapp) { r.whatsapp = whatsapp; return this; }
        public Builder role(Role role) { r.role = role; return this; }
        public Builder photoUrl(String photoUrl) { r.photoUrl = photoUrl; return this; }
        public Builder active(boolean active) { r.active = active; return this; }
        public Builder assignedPropertiesCount(long assignedPropertiesCount) { r.assignedPropertiesCount = assignedPropertiesCount; return this; }
        public Builder assignedLeadsCount(long assignedLeadsCount) { r.assignedLeadsCount = assignedLeadsCount; return this; }
        public Builder createdAt(LocalDateTime createdAt) { r.createdAt = createdAt; return this; }

        public AgentResponse build() {
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public long getAssignedPropertiesCount() { return assignedPropertiesCount; }
    public void setAssignedPropertiesCount(long assignedPropertiesCount) { this.assignedPropertiesCount = assignedPropertiesCount; }

    public long getAssignedLeadsCount() { return assignedLeadsCount; }
    public void setAssignedLeadsCount(long assignedLeadsCount) { this.assignedLeadsCount = assignedLeadsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
