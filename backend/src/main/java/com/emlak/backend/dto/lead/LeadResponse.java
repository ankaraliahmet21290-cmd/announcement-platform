package com.emlak.backend.dto.lead;

import com.emlak.backend.domain.enums.LeadSource;
import com.emlak.backend.domain.enums.LeadStatus;
import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyType;

import java.time.LocalDateTime;

public class LeadResponse {

    private Long id;
    private Long tenantId;

    private Long propertyId;
    private String propertyTitle;

    private Long assignedAgentId;
    private String assignedAgentName;

    private String fullName;
    private String phone;
    private String email;
    private String message;

    private ListingType requestType;
    private PropertyType category;
    private LeadSource source;
    private LeadStatus status;
    private boolean kvkkConsent;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LeadResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final LeadResponse r = new LeadResponse();

        public Builder id(Long id) { r.id = id; return this; }
        public Builder tenantId(Long tenantId) { r.tenantId = tenantId; return this; }
        public Builder propertyId(Long propertyId) { r.propertyId = propertyId; return this; }
        public Builder propertyTitle(String propertyTitle) { r.propertyTitle = propertyTitle; return this; }
        public Builder assignedAgentId(Long assignedAgentId) { r.assignedAgentId = assignedAgentId; return this; }
        public Builder assignedAgentName(String assignedAgentName) { r.assignedAgentName = assignedAgentName; return this; }
        public Builder fullName(String fullName) { r.fullName = fullName; return this; }
        public Builder phone(String phone) { r.phone = phone; return this; }
        public Builder email(String email) { r.email = email; return this; }
        public Builder message(String message) { r.message = message; return this; }
        public Builder requestType(ListingType requestType) { r.requestType = requestType; return this; }
        public Builder category(PropertyType category) { r.category = category; return this; }
        public Builder source(LeadSource source) { r.source = source; return this; }
        public Builder status(LeadStatus status) { r.status = status; return this; }
        public Builder kvkkConsent(boolean kvkkConsent) { r.kvkkConsent = kvkkConsent; return this; }
        public Builder notes(String notes) { r.notes = notes; return this; }
        public Builder createdAt(LocalDateTime createdAt) { r.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { r.updatedAt = updatedAt; return this; }

        public LeadResponse build() {
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getPropertyTitle() { return propertyTitle; }
    public void setPropertyTitle(String propertyTitle) { this.propertyTitle = propertyTitle; }

    public Long getAssignedAgentId() { return assignedAgentId; }
    public void setAssignedAgentId(Long assignedAgentId) { this.assignedAgentId = assignedAgentId; }

    public String getAssignedAgentName() { return assignedAgentName; }
    public void setAssignedAgentName(String assignedAgentName) { this.assignedAgentName = assignedAgentName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public ListingType getRequestType() { return requestType; }
    public void setRequestType(ListingType requestType) { this.requestType = requestType; }

    public PropertyType getCategory() { return category; }
    public void setCategory(PropertyType category) { this.category = category; }

    public LeadSource getSource() { return source; }
    public void setSource(LeadSource source) { this.source = source; }

    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }

    public boolean isKvkkConsent() { return kvkkConsent; }
    public void setKvkkConsent(boolean kvkkConsent) { this.kvkkConsent = kvkkConsent; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
