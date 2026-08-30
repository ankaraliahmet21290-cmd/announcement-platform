package com.emlak.backend.dto.property;

public class PropertyImageDto {
    private Long id;
    private String url;
    private Integer sortOrder;

    public PropertyImageDto() {}

    public PropertyImageDto(Long id, String url, Integer sortOrder) {
        this.id = id;
        this.url = url;
        this.sortOrder = sortOrder;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String url;
        private Integer sortOrder;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder url(String url) { this.url = url; return this; }
        public Builder sortOrder(Integer sortOrder) { this.sortOrder = sortOrder; return this; }

        public PropertyImageDto build() {
            return new PropertyImageDto(id, url, sortOrder);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
