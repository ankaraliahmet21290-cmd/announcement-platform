package com.emlak.backend.dto.dashboard;

import com.emlak.backend.dto.lead.LeadResponse;
import com.emlak.backend.dto.property.PropertySummaryResponse;
import com.emlak.backend.dto.tenant.TenantResponse;

import java.util.List;
import java.util.Map;

public class DashboardSummaryResponse {

    private String role;

    // Super Admin Metrikleri
    private Long totalTenants;
    private Long activeTenants;
    private Long platformTotalProperties;
    private Long platformTotalLeads;
    private Long platformTotalAgents;
    private List<TenantResponse> tenantList;

    // Office Admin Metrikleri
    private Long totalProperties;
    private Long publishedProperties;
    private Long draftProperties;
    private Long passiveProperties;
    private Long totalLeads;
    private Long newLeads;
    private Long contactedLeads;
    private Long closedLeads;
    private Long totalAgents;
    private Map<String, Long> propertiesByType;
    private List<LeadResponse> recentLeads;

    // Agent Metrikleri
    private Long myAssignedPropertiesCount;
    private Long myAssignedLeadsCount;
    private Long myNewLeadsCount;
    private List<LeadResponse> myRecentLeads;
    private List<PropertySummaryResponse> myProperties;

    public DashboardSummaryResponse() {}

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final DashboardSummaryResponse r = new DashboardSummaryResponse();

        public Builder role(String role) { r.role = role; return this; }
        public Builder totalTenants(Long totalTenants) { r.totalTenants = totalTenants; return this; }
        public Builder activeTenants(Long activeTenants) { r.activeTenants = activeTenants; return this; }
        public Builder platformTotalProperties(Long platformTotalProperties) { r.platformTotalProperties = platformTotalProperties; return this; }
        public Builder platformTotalLeads(Long platformTotalLeads) { r.platformTotalLeads = platformTotalLeads; return this; }
        public Builder platformTotalAgents(Long platformTotalAgents) { r.platformTotalAgents = platformTotalAgents; return this; }
        public Builder tenantList(List<TenantResponse> tenantList) { r.tenantList = tenantList; return this; }
        public Builder totalProperties(Long totalProperties) { r.totalProperties = totalProperties; return this; }
        public Builder publishedProperties(Long publishedProperties) { r.publishedProperties = publishedProperties; return this; }
        public Builder draftProperties(Long draftProperties) { r.draftProperties = draftProperties; return this; }
        public Builder passiveProperties(Long passiveProperties) { r.passiveProperties = passiveProperties; return this; }
        public Builder totalLeads(Long totalLeads) { r.totalLeads = totalLeads; return this; }
        public Builder newLeads(Long newLeads) { r.newLeads = newLeads; return this; }
        public Builder contactedLeads(Long contactedLeads) { r.contactedLeads = contactedLeads; return this; }
        public Builder closedLeads(Long closedLeads) { r.closedLeads = closedLeads; return this; }
        public Builder totalAgents(Long totalAgents) { r.totalAgents = totalAgents; return this; }
        public Builder propertiesByType(Map<String, Long> propertiesByType) { r.propertiesByType = propertiesByType; return this; }
        public Builder recentLeads(List<LeadResponse> recentLeads) { r.recentLeads = recentLeads; return this; }
        public Builder myAssignedPropertiesCount(Long myAssignedPropertiesCount) { r.myAssignedPropertiesCount = myAssignedPropertiesCount; return this; }
        public Builder myAssignedLeadsCount(Long myAssignedLeadsCount) { r.myAssignedLeadsCount = myAssignedLeadsCount; return this; }
        public Builder myNewLeadsCount(Long myNewLeadsCount) { r.myNewLeadsCount = myNewLeadsCount; return this; }
        public Builder myRecentLeads(List<LeadResponse> myRecentLeads) { r.myRecentLeads = myRecentLeads; return this; }
        public Builder myProperties(List<PropertySummaryResponse> myProperties) { r.myProperties = myProperties; return this; }

        public DashboardSummaryResponse build() {
            return r;
        }
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getTotalTenants() { return totalTenants; }
    public void setTotalTenants(Long totalTenants) { this.totalTenants = totalTenants; }

    public Long getActiveTenants() { return activeTenants; }
    public void setActiveTenants(Long activeTenants) { this.activeTenants = activeTenants; }

    public Long getPlatformTotalProperties() { return platformTotalProperties; }
    public void setPlatformTotalProperties(Long platformTotalProperties) { this.platformTotalProperties = platformTotalProperties; }

    public Long getPlatformTotalLeads() { return platformTotalLeads; }
    public void setPlatformTotalLeads(Long platformTotalLeads) { this.platformTotalLeads = platformTotalLeads; }

    public Long getPlatformTotalAgents() { return platformTotalAgents; }
    public void setPlatformTotalAgents(Long platformTotalAgents) { this.platformTotalAgents = platformTotalAgents; }

    public List<TenantResponse> getTenantList() { return tenantList; }
    public void setTenantList(List<TenantResponse> tenantList) { this.tenantList = tenantList; }

    public Long getTotalProperties() { return totalProperties; }
    public void setTotalProperties(Long totalProperties) { this.totalProperties = totalProperties; }

    public Long getPublishedProperties() { return publishedProperties; }
    public void setPublishedProperties(Long publishedProperties) { this.publishedProperties = publishedProperties; }

    public Long getDraftProperties() { return draftProperties; }
    public void setDraftProperties(Long draftProperties) { this.draftProperties = draftProperties; }

    public Long getPassiveProperties() { return passiveProperties; }
    public void setPassiveProperties(Long passiveProperties) { this.passiveProperties = passiveProperties; }

    public Long getTotalLeads() { return totalLeads; }
    public void setTotalLeads(Long totalLeads) { this.totalLeads = totalLeads; }

    public Long getNewLeads() { return newLeads; }
    public void setNewLeads(Long newLeads) { this.newLeads = newLeads; }

    public Long getContactedLeads() { return contactedLeads; }
    public void setContactedLeads(Long contactedLeads) { this.contactedLeads = contactedLeads; }

    public Long getClosedLeads() { return closedLeads; }
    public void setClosedLeads(Long closedLeads) { this.closedLeads = closedLeads; }

    public Long getTotalAgents() { return totalAgents; }
    public void setTotalAgents(Long totalAgents) { this.totalAgents = totalAgents; }

    public Map<String, Long> getPropertiesByType() { return propertiesByType; }
    public void setPropertiesByType(Map<String, Long> propertiesByType) { this.propertiesByType = propertiesByType; }

    public List<LeadResponse> getRecentLeads() { return recentLeads; }
    public void setRecentLeads(List<LeadResponse> recentLeads) { this.recentLeads = recentLeads; }

    public Long getMyAssignedPropertiesCount() { return myAssignedPropertiesCount; }
    public void setMyAssignedPropertiesCount(Long myAssignedPropertiesCount) { this.myAssignedPropertiesCount = myAssignedPropertiesCount; }

    public Long getMyAssignedLeadsCount() { return myAssignedLeadsCount; }
    public void setMyAssignedLeadsCount(Long myAssignedLeadsCount) { this.myAssignedLeadsCount = myAssignedLeadsCount; }

    public Long getMyNewLeadsCount() { return myNewLeadsCount; }
    public void setMyNewLeadsCount(Long myNewLeadsCount) { this.myNewLeadsCount = myNewLeadsCount; }

    public List<LeadResponse> getMyRecentLeads() { return myRecentLeads; }
    public void setMyRecentLeads(List<LeadResponse> myRecentLeads) { this.myRecentLeads = myRecentLeads; }

    public List<PropertySummaryResponse> getMyProperties() { return myProperties; }
    public void setMyProperties(List<PropertySummaryResponse> myProperties) { this.myProperties = myProperties; }
}
