package com.emlak.backend.domain.entity;

import com.emlak.backend.domain.enums.TenantStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    // TODO: Faz 2 custom domain bağlama ve SSL otomasyonu
    @Column(name = "custom_domain")
    private String customDomain;

    private String phone;
    private String whatsapp;
    private String email;
    private String address;

    @Column(name = "about_text", columnDefinition = "TEXT")
    private String aboutText;

    @Column(name = "logo_url")
    private String logoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TenantStatus status = TenantStatus.ACTIVE;

    // TODO: Faz 2 / Faz 3 Stripe/iyzico billing entegrasyonu
    @Column(name = "plan_name", nullable = false)
    private String planName = "TRIAL";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Tenant() {}

    public Tenant(Long id, String name, String slug, String customDomain, String phone, String whatsapp, String email, String address, String aboutText, String logoUrl, TenantStatus status, String planName, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.customDomain = customDomain;
        this.phone = phone;
        this.whatsapp = whatsapp;
        this.email = email;
        this.address = address;
        this.aboutText = aboutText;
        this.logoUrl = logoUrl;
        this.status = status != null ? status : TenantStatus.ACTIVE;
        this.planName = planName != null ? planName : "TRIAL";
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String slug;
        private String customDomain;
        private String phone;
        private String whatsapp;
        private String email;
        private String address;
        private String aboutText;
        private String logoUrl;
        private TenantStatus status = TenantStatus.ACTIVE;
        private String planName = "TRIAL";
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder slug(String slug) { this.slug = slug; return this; }
        public Builder customDomain(String customDomain) { this.customDomain = customDomain; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder whatsapp(String whatsapp) { this.whatsapp = whatsapp; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder aboutText(String aboutText) { this.aboutText = aboutText; return this; }
        public Builder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }
        public Builder status(TenantStatus status) { this.status = status; return this; }
        public Builder planName(String planName) { this.planName = planName; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Tenant build() {
            return new Tenant(id, name, slug, customDomain, phone, whatsapp, email, address, aboutText, logoUrl, status, planName, createdAt, updatedAt);
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

    public String getAboutText() { return aboutText; }
    public void setAboutText(String aboutText) { this.aboutText = aboutText; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public TenantStatus getStatus() { return status; }
    public void setStatus(TenantStatus status) { this.status = status; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
