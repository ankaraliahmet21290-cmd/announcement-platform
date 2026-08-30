package com.emlak.backend.dto.lead;

import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PublicLeadCreateRequest {

    private Long propertyId;

    @NotBlank(message = "Ad Soyad zorunludur")
    private String fullName;

    @NotBlank(message = "Telefon numarası zorunludur")
    private String phone;

    private String email;
    private String message;

    @NotNull(message = "Talep tipi zorunludur")
    private ListingType requestType;

    @NotNull(message = "Kategori zorunludur")
    private PropertyType category;

    @AssertTrue(message = "KVKK aydınlatma metnini onaylamanız gerekmektedir")
    private boolean kvkkConsent;

    public PublicLeadCreateRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

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

    public boolean isKvkkConsent() { return kvkkConsent; }
    public void setKvkkConsent(boolean kvkkConsent) { this.kvkkConsent = kvkkConsent; }
}
