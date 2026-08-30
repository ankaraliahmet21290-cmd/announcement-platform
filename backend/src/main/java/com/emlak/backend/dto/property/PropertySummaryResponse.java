package com.emlak.backend.dto.property;

import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyStatus;
import com.emlak.backend.domain.enums.PropertyType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PropertySummaryResponse {
    private Long id;
    private String title;
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
    private PropertyStatus status;
    private Long viewCount;
    private String coverImage;
    private Long agentId;
    private String agentName;
    private LocalDateTime createdAt;

    public PropertySummaryResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PropertySummaryResponse r = new PropertySummaryResponse();

        public Builder id(Long id) { r.id = id; return this; }
        public Builder title(String title) { r.title = title; return this; }
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
        public Builder status(PropertyStatus status) { r.status = status; return this; }
        public Builder viewCount(Long viewCount) { r.viewCount = viewCount; return this; }
        public Builder coverImage(String coverImage) { r.coverImage = coverImage; return this; }
        public Builder agentId(Long agentId) { r.agentId = agentId; return this; }
        public Builder agentName(String agentName) { r.agentName = agentName; return this; }
        public Builder createdAt(LocalDateTime createdAt) { r.createdAt = createdAt; return this; }

        public PropertySummaryResponse build() {
            return r;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

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

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }

    public String getAgentName() { return agentName; }
    public void setAgentName(String agentName) { this.agentName = agentName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
