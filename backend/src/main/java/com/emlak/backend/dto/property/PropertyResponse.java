package com.emlak.backend.dto.property;

import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyStatus;
import com.emlak.backend.domain.enums.PropertyType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PropertyResponse {

    private Long id;
    private Long tenantId;
    private String tenantName;
    private String tenantSlug;
    private String tenantPhone;
    private String tenantWhatsapp;

    private Long agentId;
    private String agentName;
    private String agentEmail;
    private String agentPhone;
    private String agentWhatsapp;
    private String agentPhotoUrl;

    private String title;
    private String description;
    private ListingType listingType;
    private PropertyType propertyType;
    private BigDecimal price;
    private String currency;
    private String city;
    private String district;
    private String neighborhood;

    private Integer grossArea;
    private Integer netArea;
    private String roomCount;
    private String buildingAge;
    private String floor;
    private Integer totalFloors;
    private String heatingType;
    private String deedStatus;
    private String usageStatus;
    private String facade;

    private boolean suitableForLoan;
    private boolean furnished;
    private boolean hasElevator;
    private boolean hasBalcony;
    private boolean hasParking;
    private boolean inSite;
    private Integer bathroomCount;

    private Double latitude;
    private Double longitude;

    private String eidsReference;
    private LocalDate eidsExpiryDate;

    private PropertyStatus status;
    private Long viewCount;

    private List<PropertyImageDto> images;
    private String coverImage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PropertyResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PropertyResponse r = new PropertyResponse();

        public Builder id(Long id) { r.id = id; return this; }
        public Builder tenantId(Long tenantId) { r.tenantId = tenantId; return this; }
        public Builder tenantName(String tenantName) { r.tenantName = tenantName; return this; }
        public Builder tenantSlug(String tenantSlug) { r.tenantSlug = tenantSlug; return this; }
        public Builder tenantPhone(String tenantPhone) { r.tenantPhone = tenantPhone; return this; }
        public Builder tenantWhatsapp(String tenantWhatsapp) { r.tenantWhatsapp = tenantWhatsapp; return this; }
        public Builder agentId(Long agentId) { r.agentId = agentId; return this; }
        public Builder agentName(String agentName) { r.agentName = agentName; return this; }
        public Builder agentEmail(String agentEmail) { r.agentEmail = agentEmail; return this; }
        public Builder agentPhone(String agentPhone) { r.agentPhone = agentPhone; return this; }
        public Builder agentWhatsapp(String agentWhatsapp) { r.agentWhatsapp = agentWhatsapp; return this; }
        public Builder agentPhotoUrl(String agentPhotoUrl) { r.agentPhotoUrl = agentPhotoUrl; return this; }
        public Builder title(String title) { r.title = title; return this; }
        public Builder description(String description) { r.description = description; return this; }
        public Builder listingType(ListingType listingType) { r.listingType = listingType; return this; }
        public Builder propertyType(PropertyType propertyType) { r.propertyType = propertyType; return this; }
        public Builder price(BigDecimal price) { r.price = price; return this; }
        public Builder currency(String currency) { r.currency = currency; return this; }
        public Builder city(String city) { r.city = city; return this; }
        public Builder district(String district) { r.district = district; return this; }
        public Builder neighborhood(String neighborhood) { r.neighborhood = neighborhood; return this; }
        public Builder grossArea(Integer grossArea) { r.grossArea = grossArea; return this; }
        public Builder netArea(Integer netArea) { r.netArea = netArea; return this; }
        public Builder roomCount(String roomCount) { r.roomCount = roomCount; return this; }
        public Builder buildingAge(String buildingAge) { r.buildingAge = buildingAge; return this; }
        public Builder floor(String floor) { r.floor = floor; return this; }
        public Builder totalFloors(Integer totalFloors) { r.totalFloors = totalFloors; return this; }
        public Builder heatingType(String heatingType) { r.heatingType = heatingType; return this; }
        public Builder deedStatus(String deedStatus) { r.deedStatus = deedStatus; return this; }
        public Builder usageStatus(String usageStatus) { r.usageStatus = usageStatus; return this; }
        public Builder facade(String facade) { r.facade = facade; return this; }
        public Builder suitableForLoan(boolean suitableForLoan) { r.suitableForLoan = suitableForLoan; return this; }
        public Builder furnished(boolean furnished) { r.furnished = furnished; return this; }
        public Builder hasElevator(boolean hasElevator) { r.hasElevator = hasElevator; return this; }
        public Builder hasBalcony(boolean hasBalcony) { r.hasBalcony = hasBalcony; return this; }
        public Builder hasParking(boolean hasParking) { r.hasParking = hasParking; return this; }
        public Builder inSite(boolean inSite) { r.inSite = inSite; return this; }
        public Builder bathroomCount(Integer bathroomCount) { r.bathroomCount = bathroomCount; return this; }
        public Builder latitude(Double latitude) { r.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { r.longitude = longitude; return this; }
        public Builder eidsReference(String eidsReference) { r.eidsReference = eidsReference; return this; }
        public Builder eidsExpiryDate(LocalDate eidsExpiryDate) { r.eidsExpiryDate = eidsExpiryDate; return this; }
        public Builder status(PropertyStatus status) { r.status = status; return this; }
        public Builder viewCount(Long viewCount) { r.viewCount = viewCount; return this; }
        public Builder images(List<PropertyImageDto> images) { r.images = images; return this; }
        public Builder coverImage(String coverImage) { r.coverImage = coverImage; return this; }
        public Builder createdAt(LocalDateTime createdAt) { r.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { r.updatedAt = updatedAt; return this; }

        public PropertyResponse build() {
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }

    public String getTenantName() { return tenantName; }
    public void setTenantName(String tenantName) { this.tenantName = tenantName; }

    public String getTenantSlug() { return tenantSlug; }
    public void setTenantSlug(String tenantSlug) { this.tenantSlug = tenantSlug; }

    public String getTenantPhone() { return tenantPhone; }
    public void setTenantPhone(String tenantPhone) { this.tenantPhone = tenantPhone; }

    public String getTenantWhatsapp() { return tenantWhatsapp; }
    public void setTenantWhatsapp(String tenantWhatsapp) { this.tenantWhatsapp = tenantWhatsapp; }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }

    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }

    public String getAgentEmail() { return agentEmail; }
    public void setAgentEmail(String agentEmail) { this.agentEmail = agentEmail; }

    public String getAgentPhone() { return agentPhone; }
    public void setAgentPhone(String agentPhone) { this.agentPhone = agentPhone; }

    public String getAgentWhatsapp() { return agentWhatsapp; }
    public void setAgentWhatsapp(String agentWhatsapp) { this.agentWhatsapp = agentWhatsapp; }

    public String getAgentPhotoUrl() { return agentPhotoUrl; }
    public void setAgentPhotoUrl(String agentPhotoUrl) { this.agentPhotoUrl = agentPhotoUrl; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ListingType getListingType() { return listingType; }
    public void setListingType(ListingType listingType) { this.listingType = listingType; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }

    public Integer getGrossArea() { return grossArea; }
    public void setGrossArea(Integer grossArea) { this.grossArea = grossArea; }

    public Integer getNetArea() { return netArea; }
    public void setNetArea(Integer netArea) { this.netArea = netArea; }

    public String getRoomCount() { return roomCount; }
    public void setRoomCount(String roomCount) { this.roomCount = roomCount; }

    public String getBuildingAge() { return buildingAge; }
    public void setBuildingAge(String buildingAge) { this.buildingAge = buildingAge; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public Integer getTotalFloors() { return totalFloors; }
    public void setTotalFloors(Integer totalFloors) { this.totalFloors = totalFloors; }

    public String getHeatingType() { return heatingType; }
    public void setHeatingType(String heatingType) { this.heatingType = heatingType; }

    public String getDeedStatus() { return deedStatus; }
    public void setDeedStatus(String deedStatus) { this.deedStatus = deedStatus; }

    public String getUsageStatus() { return usageStatus; }
    public void setUsageStatus(String usageStatus) { this.usageStatus = usageStatus; }

    public String getFacade() { return facade; }
    public void setFacade(String facade) { this.facade = facade; }

    public boolean isSuitableForLoan() { return suitableForLoan; }
    public void setSuitableForLoan(boolean suitableForLoan) { this.suitableForLoan = suitableForLoan; }

    public boolean isFurnished() { return furnished; }
    public void setFurnished(boolean furnished) { this.furnished = furnished; }

    public boolean isHasElevator() { return hasElevator; }
    public void setHasElevator(boolean hasElevator) { this.hasElevator = hasElevator; }

    public boolean isHasBalcony() { return hasBalcony; }
    public void setHasBalcony(boolean hasBalcony) { this.hasBalcony = hasBalcony; }

    public boolean isHasParking() { return hasParking; }
    public void setHasParking(boolean hasParking) { this.hasParking = hasParking; }

    public boolean isInSite() { return inSite; }
    public void setInSite(boolean inSite) { this.inSite = inSite; }

    public Integer getBathroomCount() { return bathroomCount; }
    public void setBathroomCount(Integer bathroomCount) { this.bathroomCount = bathroomCount; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getEidsReference() { return eidsReference; }
    public void setEidsReference(String eidsReference) { this.eidsReference = eidsReference; }

    public LocalDate getEidsExpiryDate() { return eidsExpiryDate; }
    public void setEidsExpiryDate(LocalDate eidsExpiryDate) { this.eidsExpiryDate = eidsExpiryDate; }

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public List<PropertyImageDto> getImages() { return images; }
    public void setImages(List<PropertyImageDto> images) { this.images = images; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
