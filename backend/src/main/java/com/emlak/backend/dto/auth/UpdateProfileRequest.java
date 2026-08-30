package com.emlak.backend.dto.auth;

public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String whatsapp;
    private String photoUrl;
    private String password;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String fullName, String phone, String whatsapp, String photoUrl, String password) {
        this.fullName = fullName;
        this.phone = phone;
        this.whatsapp = whatsapp;
        this.photoUrl = photoUrl;
        this.password = password;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String fullName;
        private String phone;
        private String whatsapp;
        private String photoUrl;
        private String password;

        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder whatsapp(String whatsapp) { this.whatsapp = whatsapp; return this; }
        public Builder photoUrl(String photoUrl) { this.photoUrl = photoUrl; return this; }
        public Builder password(String password) { this.password = password; return this; }

        public UpdateProfileRequest build() {
            return new UpdateProfileRequest(fullName, phone, whatsapp, photoUrl, password);
        }
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
