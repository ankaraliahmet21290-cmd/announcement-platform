package com.emlak.backend.dto.property;

import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyStatus;
import com.emlak.backend.domain.enums.PropertyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PropertyCreateRequest {

    private Long agentId;

    @NotBlank(message = "İlan başlığı zorunludur")
    private String title;

    @NotBlank(message = "İlan açıklaması zorunludur")
    private String description;

    @NotNull(message = "İşlem tipi (SATILIK/KİRALIK) zorunludur")
    private ListingType listingType;

    @NotNull(message = "Emlak tipi (KONUT/ARSA/İŞYERİ) zorunludur")
    private PropertyType propertyType;

    @NotNull(message = "Fiyat zorunludur")
    @Positive(message = "Fiyat pozitif bir değer olmalıdır")
    private BigDecimal price;

    private String currency = "TRY";

    @NotBlank(message = "İl zorunludur")
    private String city;

    @NotBlank(message = "İlçe zorunludur")
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

    private Boolean suitableForLoan;
    private Boolean furnished;
    private Boolean hasElevator;
    private Boolean hasBalcony;
    private Boolean hasParking;
    private Boolean inSite;
    private Integer bathroomCount;

    private Double latitude;
    private Double longitude;

    private String eidsReference;
    private LocalDate eidsExpiryDate;

    private PropertyStatus status;
    private List<String> imageUrls;

    public PropertyCreateRequest() {}

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }

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

    public Boolean getSuitableForLoan() { return suitableForLoan; }
    public void setSuitableForLoan(Boolean suitableForLoan) { this.suitableForLoan = suitableForLoan; }

    public Boolean getFurnished() { return furnished; }
    public void setFurnished(Boolean furnished) { this.furnished = furnished; }

    public Boolean getHasElevator() { return hasElevator; }
    public void setHasElevator(Boolean hasElevator) { this.hasElevator = hasElevator; }

    public Boolean getHasBalcony() { return hasBalcony; }
    public void setHasBalcony(Boolean hasBalcony) { this.hasBalcony = hasBalcony; }

    public Boolean getHasParking() { return hasParking; }
    public void setHasParking(Boolean hasParking) { this.hasParking = hasParking; }

    public Boolean getInSite() { return inSite; }
    public void setInSite(Boolean inSite) { this.inSite = inSite; }

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

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
