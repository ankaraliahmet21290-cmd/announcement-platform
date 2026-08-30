package com.emlak.backend.domain.entity;

import com.emlak.backend.domain.enums.ListingType;
import com.emlak.backend.domain.enums.PropertyStatus;
import com.emlak.backend.domain.enums.PropertyType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private AppUser agent;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type", nullable = false)
    private ListingType listingType;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 10)
    private String currency = "TRY";

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String district;

    private String neighborhood;

    @Column(name = "gross_area")
    private Integer grossArea;

    @Column(name = "net_area")
    private Integer netArea;

    @Column(name = "room_count")
    private String roomCount;

    @Column(name = "building_age")
    private String buildingAge;

    private String floor;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column(name = "heating_type")
    private String heatingType;

    @Column(name = "deed_status")
    private String deedStatus;

    @Column(name = "usage_status")
    private String usageStatus;

    private String facade;

    @Column(name = "suitable_for_loan")
    private boolean suitableForLoan = false;

    private boolean furnished = false;

    @Column(name = "has_elevator")
    private boolean hasElevator = false;

    @Column(name = "has_balcony")
    private boolean hasBalcony = false;

    @Column(name = "has_parking")
    private boolean hasParking = false;

    @Column(name = "in_site")
    private boolean inSite = false;

    @Column(name = "bathroom_count")
    private Integer bathroomCount;

    private Double latitude;
    private Double longitude;

    @Column(name = "eids_reference")
    private String eidsReference;

    @Column(name = "eids_expiry_date")
    private LocalDate eidsExpiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status = PropertyStatus.DRAFT;

    @Column(name = "view_count", nullable = false)
    private Long viewCount = 0L;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<PropertyImage> images = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Property() {}

    public Property(Long id, Tenant tenant, AppUser agent, String title, String description, ListingType listingType, PropertyType propertyType, BigDecimal price, String currency, String city, String district, String neighborhood, Integer grossArea, Integer netArea, String roomCount, String buildingAge, String floor, Integer totalFloors, String heatingType, String deedStatus, String usageStatus, String facade, boolean suitableForLoan, boolean furnished, boolean hasElevator, boolean hasBalcony, boolean hasParking, boolean inSite, Integer bathroomCount, Double latitude, Double longitude, String eidsReference, LocalDate eidsExpiryDate, PropertyStatus status, Long viewCount, List<PropertyImage> images, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.tenant = tenant;
        this.agent = agent;
        this.title = title;
        this.description = description;
        this.listingType = listingType;
        this.propertyType = propertyType;
        this.price = price;
        this.currency = currency != null ? currency : "TRY";
        this.city = city;
        this.district = district;
        this.neighborhood = neighborhood;
        this.grossArea = grossArea;
        this.netArea = netArea;
        this.roomCount = roomCount;
        this.buildingAge = buildingAge;
        this.floor = floor;
        this.totalFloors = totalFloors;
        this.heatingType = heatingType;
        this.deedStatus = deedStatus;
        this.usageStatus = usageStatus;
        this.facade = facade;
        this.suitableForLoan = suitableForLoan;
        this.furnished = furnished;
        this.hasElevator = hasElevator;
        this.hasBalcony = hasBalcony;
        this.hasParking = hasParking;
        this.inSite = inSite;
        this.bathroomCount = bathroomCount;
        this.latitude = latitude;
        this.longitude = longitude;
        this.eidsReference = eidsReference;
        this.eidsExpiryDate = eidsExpiryDate;
        this.status = status != null ? status : PropertyStatus.DRAFT;
        this.viewCount = viewCount != null ? viewCount : 0L;
        this.images = images != null ? images : new ArrayList<>();
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Tenant tenant;
        private AppUser agent;
        private String title;
        private String description;
        private ListingType listingType;
        private PropertyType propertyType;
        private BigDecimal price;
        private String currency = "TRY";
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
        private boolean suitableForLoan = false;
        private boolean furnished = false;
        private boolean hasElevator = false;
        private boolean hasBalcony = false;
        private boolean hasParking = false;
        private boolean inSite = false;
        private Integer bathroomCount;
        private Double latitude;
        private Double longitude;
        private String eidsReference;
        private LocalDate eidsExpiryDate;
        private PropertyStatus status = PropertyStatus.DRAFT;
        private Long viewCount = 0L;
        private List<PropertyImage> images = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder tenant(Tenant tenant) { this.tenant = tenant; return this; }
        public Builder agent(AppUser agent) { this.agent = agent; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder listingType(ListingType listingType) { this.listingType = listingType; return this; }
        public Builder propertyType(PropertyType propertyType) { this.propertyType = propertyType; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder district(String district) { this.district = district; return this; }
        public Builder neighborhood(String neighborhood) { this.neighborhood = neighborhood; return this; }
        public Builder grossArea(Integer grossArea) { this.grossArea = grossArea; return this; }
        public Builder netArea(Integer netArea) { this.netArea = netArea; return this; }
        public Builder roomCount(String roomCount) { this.roomCount = roomCount; return this; }
        public Builder buildingAge(String buildingAge) { this.buildingAge = buildingAge; return this; }
        public Builder floor(String floor) { this.floor = floor; return this; }
        public Builder totalFloors(Integer totalFloors) { this.totalFloors = totalFloors; return this; }
        public Builder heatingType(String heatingType) { this.heatingType = heatingType; return this; }
        public Builder deedStatus(String deedStatus) { this.deedStatus = deedStatus; return this; }
        public Builder usageStatus(String usageStatus) { this.usageStatus = usageStatus; return this; }
        public Builder facade(String facade) { this.facade = facade; return this; }
        public Builder suitableForLoan(boolean suitableForLoan) { this.suitableForLoan = suitableForLoan; return this; }
        public Builder furnished(boolean furnished) { this.furnished = furnished; return this; }
        public Builder hasElevator(boolean hasElevator) { this.hasElevator = hasElevator; return this; }
        public Builder hasBalcony(boolean hasBalcony) { this.hasBalcony = hasBalcony; return this; }
        public Builder hasParking(boolean hasParking) { this.hasParking = hasParking; return this; }
        public Builder inSite(boolean inSite) { this.inSite = inSite; return this; }
        public Builder bathroomCount(Integer bathroomCount) { this.bathroomCount = bathroomCount; return this; }
        public Builder latitude(Double latitude) { this.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { this.longitude = longitude; return this; }
        public Builder eidsReference(String eidsReference) { this.eidsReference = eidsReference; return this; }
        public Builder eidsExpiryDate(LocalDate eidsExpiryDate) { this.eidsExpiryDate = eidsExpiryDate; return this; }
        public Builder status(PropertyStatus status) { this.status = status; return this; }
        public Builder viewCount(Long viewCount) { this.viewCount = viewCount; return this; }
        public Builder images(List<PropertyImage> images) { this.images = images; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Property build() {
            return new Property(id, tenant, agent, title, description, listingType, propertyType, price, currency, city, district, neighborhood, grossArea, netArea, roomCount, buildingAge, floor, totalFloors, heatingType, deedStatus, usageStatus, facade, suitableForLoan, furnished, hasElevator, hasBalcony, hasParking, inSite, bathroomCount, latitude, longitude, eidsReference, eidsExpiryDate, status, viewCount, images, createdAt, updatedAt);
        }
    }

    public void addImage(PropertyImage image) {
        images.add(image);
        image.setProperty(this);
    }

    public void removeImage(PropertyImage image) {
        images.remove(image);
        image.setProperty(null);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Tenant getTenant() { return tenant; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }

    public AppUser getAgent() { return agent; }
    public void setAgent(AppUser agent) { this.agent = agent; }

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

    public List<PropertyImage> getImages() { return images; }
    public void setImages(List<PropertyImage> images) { this.images = images; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
