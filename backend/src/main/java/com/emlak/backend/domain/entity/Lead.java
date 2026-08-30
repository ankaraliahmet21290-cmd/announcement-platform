package com.emlak.backend.domain.entity;

import com.emlak.backend.domain.enums.LeadSource;
import com.emlak.backend.domain.enums.LeadStatus;
import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private AppUser assignedAgent;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "request_type", nullable = false)
    private ListingType requestType;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private PropertyType category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadSource source = LeadSource.WEB_FORM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadStatus status = LeadStatus.NEW;

    @Column(name = "kvkk_consent", nullable = false)
    private boolean kvkkConsent = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Lead() {}

    public Lead(Long id, Tenant tenant, Property property, AppUser assignedAgent, String fullName, String phone, String email, String message, ListingType requestType, PropertyType category, LeadSource source, LeadStatus status, boolean kvkkConsent, String notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.tenant = tenant;
        this.property = property;
        this.assignedAgent = assignedAgent;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.message = message;
        this.requestType = requestType;
        this.category = category;
        this.source = source != null ? source : LeadSource.WEB_FORM;
        this.status = status != null ? status : LeadStatus.NEW;
        this.kvkkConsent = kvkkConsent;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Tenant tenant;
        private Property property;
        private AppUser assignedAgent;
        private String fullName;
        private String phone;
        private String email;
        private String message;
        private ListingType requestType;
        private PropertyType category;
        private LeadSource source = LeadSource.WEB_FORM;
        private LeadStatus status = LeadStatus.NEW;
        private boolean kvkkConsent = false;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder tenant(Tenant tenant) { this.tenant = tenant; return this; }
        public Builder property(Property property) { this.property = property; return this; }
        public Builder assignedAgent(AppUser assignedAgent) { this.assignedAgent = assignedAgent; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder requestType(ListingType requestType) { this.requestType = requestType; return this; }
        public Builder category(PropertyType category) { this.category = category; return this; }
        public Builder source(LeadSource source) { this.source = source; return this; }
        public Builder status(LeadStatus status) { this.status = status; return this; }
        public Builder kvkkConsent(boolean kvkkConsent) { this.kvkkConsent = kvkkConsent; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Lead build() {
            return new Lead(id, tenant, property, assignedAgent, fullName, phone, email, message, requestType, category, source, status, kvkkConsent, notes, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Tenant getTenant() { return tenant; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public AppUser getAssignedAgent() { return assignedAgent; }
    public void setAssignedAgent(AppUser assignedAgent) { this.assignedAgent = assignedAgent; }

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
