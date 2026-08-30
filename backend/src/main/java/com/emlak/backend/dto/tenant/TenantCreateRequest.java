package com.emlak.backend.dto.tenant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class TenantCreateRequest {

    @NotBlank(message = "Firma adı zorunludur")
    private String name;

    @NotBlank(message = "Slug (kısa ad) zorunludur")
    private String slug;

    private String phone;
    private String whatsapp;
    private String email;
    private String address;
    private String logoUrl;
    private String aboutText;

    // İlk Office Admin bilgileri
    @NotBlank(message = "Yönetici Adı Soyadı zorunludur")
    private String adminFullName;

    @NotBlank(message = "Yönetici Email zorunludur")
    @Email(message = "Geçerli bir yönetici email adresi giriniz")
    private String adminEmail;

    @NotBlank(message = "Yönetici Şifre zorunludur")
    private String adminPassword;

    private String adminPhone;

    public TenantCreateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

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

    public String getAdminFullName() { return adminFullName; }
    public void setAdminFullName(String adminFullName) { this.adminFullName = adminFullName; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }

    public String getAdminPhone() { return adminPhone; }
    public void setAdminPhone(String adminPhone) { this.adminPhone = adminPhone; }
}
