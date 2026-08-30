package com.emlak.backend.dto.agent;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AgentCreateRequest {

    @NotBlank(message = "Danışman adı soyadı zorunludur")
    private String fullName;

    @NotBlank(message = "Email zorunludur")
    @Email(message = "Geçerli bir email adresi giriniz")
    private String email;

    @NotBlank(message = "Şifre zorunludur")
    private String password;

    private String phone;
    private String whatsapp;
    private String photoUrl;

    public AgentCreateRequest() {}

    public AgentCreateRequest(String fullName, String email, String password, String phone, String whatsapp, String photoUrl) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.whatsapp = whatsapp;
        this.photoUrl = photoUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String fullName;
        private String email;
        private String password;
        private String phone;
        private String whatsapp;
        private String photoUrl;

        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder whatsapp(String whatsapp) { this.whatsapp = whatsapp; return this; }
        public Builder photoUrl(String photoUrl) { this.photoUrl = photoUrl; return this; }

        public AgentCreateRequest build() {
            return new AgentCreateRequest(fullName, email, password, phone, whatsapp, photoUrl);
        }
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}
