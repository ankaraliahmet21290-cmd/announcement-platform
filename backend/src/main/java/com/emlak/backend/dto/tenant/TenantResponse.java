package com.emlak.backend.dto.tenant;

import com.emlak.backend.domain.enums.TenantStatus;

import java.time.LocalDateTime;

public class TenantResponse {
    private Long id;
    private String name;
    private String slug;
    private String customDomain;
    private String phone;
    private String whatsapp;
    private String email;
    private String address;
    private String logoUrl;
    private String aboutText;
    private TenantStatus status;
    private String planName;
    private long totalProperties;
    private long totalLeads;
    private long totalAgents;
    private LocalDateTime createdAt;

    public TenantResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final TenantResponse r = new TenantResponse();

        public Builder id(Long id) { r.id = id; return this; }
        public Builder name(String name) { r.name = name; return this; }
        public Builder slug(String slug) { r.slug = slug; return this; }
        public Builder customDomain(String customDomain) { r.customDomain = customDomain; return this; }
        public Builder phone(String phone) { r.phone = phone; return this; }
        public Builder whatsapp(String whatsapp) { r.whatsapp = whatsapp; return this; }
        public Builder email(String email) { r.email = email; return this; }
        public Builder address(String address) { r.address = address; return this; }
        public Builder logoUrl(String logoUrl) { r.logoUrl = logoUrl; return this; }
        public Builder aboutText(String aboutText) { r.aboutText = aboutText; return this; }
        public Builder status(TenantStatus status) { r.status = status; return this; }
        public Builder planName(String planName) { r.planName = planName; return this; }
        public Builder totalProperties(long totalProperties) { r.totalProperties = totalProperties; return this; }
        public Builder totalLeads(long totalLeads) { r.totalLeads = totalLeads; return this; }
        public Builder totalAgents(long totalAgents) { r.totalAgents = totalAgents; return this; }
        public Builder createdAt(LocalDateTime createdAt) { r.createdAt = createdAt; return this; }

        public TenantResponse build() {
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getCustomDomain() { return customDomain; }
    public void setCustomDomain(String customDomain) { this.customDomain = customDomain; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getAboutText() { return aboutText; }
    public void setAboutText(String aboutText) { this.aboutText = aboutText; }

    public TenantStatus getStatus() { return status; }
    public void setStatus(TenantStatus status) { this.status = status; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(long totalProperties) { this.totalProperties = totalProperties; }

    public long getTotalLeads() { return totalLeads; }
    public void setTotalLeads(long totalLeads) { this.totalLeads = totalLeads; }

    public long getTotalAgents() { return totalAgents; }
    public void setTotalAgents(long totalAgents) { this.totalAgents = totalAgents; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
