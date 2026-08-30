package com.emlak.backend.controller;

import com.emlak.backend.domain.enums.PropertyStatus;
import com.emlak.backend.dto.property.PropertyCreateRequest;
import com.emlak.backend.dto.property.PropertyImageDto;
import com.emlak.backend.dto.property.PropertyResponse;
import com.emlak.backend.dto.property.PropertySummaryResponse;
import com.emlak.backend.dto.property.PropertyUpdateRequest;
import com.emlak.backend.security.UserPrincipal;
import com.emlak.backend.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public ResponseEntity<Page<PropertySummaryResponse>> getProperties(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(value = "status", required = false) PropertyStatus status,
            @RequestParam(value = "agentId", required = false) Long agentId,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(propertyService.getAdminProperties(principal, status, agentId, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getAdminPropertyById(principal, id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT')")
    public ResponseEntity<PropertyResponse> createProperty(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PropertyCreateRequest request) {
        return ResponseEntity.ok(propertyService.createProperty(principal, request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT')")
    public ResponseEntity<PropertyResponse> updateProperty(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody PropertyUpdateRequest request) {
        return ResponseEntity.ok(propertyService.updateProperty(principal, id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProperty(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        propertyService.deleteProperty(principal, id);
        return ResponseEntity.ok(Map.of("message", "İlan başarıyla silindi"));
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT')")
    public ResponseEntity<PropertyImageDto> uploadImage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(propertyService.addImage(principal, id, file));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT')")
    public ResponseEntity<Map<String, String>> deleteImage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @PathVariable Long imageId) {
        propertyService.deleteImage(principal, id, imageId);
        return ResponseEntity.ok(Map.of("message", "Görsel başarıyla silindi"));
    }
}
