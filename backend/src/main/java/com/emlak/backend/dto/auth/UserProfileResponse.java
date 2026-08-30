package com.emlak.backend.dto.auth;

import com.emlak.backend.domain.enums.Role;

public class UserProfileResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String whatsapp;
    private Role role;
    private String photoUrl;
    private Long tenantId;
    private String tenantName;
    private String tenantSlug;

    public UserProfileResponse() {}

    public UserProfileResponse(Long id, String email, String fullName, String phone, String whatsapp, Role role, String photoUrl, Long tenantId, String tenantName, String tenantSlug) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.whatsapp = whatsapp;
        this.role = role;
        this.photoUrl = photoUrl;
        this.tenantId = tenantId;
        this.tenantName = tenantName;
        this.tenantSlug = tenantSlug;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String whatsapp;
        private Role role;
        private String photoUrl;
        private Long tenantId;
        private String tenantName;
        private String tenantSlug;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder whatsapp(String whatsapp) { this.whatsapp = whatsapp; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder photoUrl(String photoUrl) { this.photoUrl = photoUrl; return this; }
        public Builder tenantId(Long tenantId) { this.tenantId = tenantId; return this; }
        public Builder tenantName(String tenantName) { this.tenantName = tenantName; return this; }
        public Builder tenantSlug(String tenantSlug) { this.tenantSlug = tenantSlug; return this; }

        public UserProfileResponse build() {
            return new UserProfileResponse(id, email, fullName, phone, whatsapp, role, photoUrl, tenantId, tenantName, tenantSlug);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }

    public String getTenantName() { return tenantName; }
    public void setTenantName(String tenantName) { this.tenantName = tenantName; }

    public String getTenantSlug() { return tenantSlug; }
    public void setTenantSlug(String tenantSlug) { this.tenantSlug = tenantSlug; }
}
