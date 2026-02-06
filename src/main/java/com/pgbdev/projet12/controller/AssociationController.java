package com.pgbdev.projet12.controller;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.dto.request.AssociationSearchRequest;
import com.pgbdev.projet12.dto.response.AssociationResponse;
import com.pgbdev.projet12.service.Scope;
import com.pgbdev.projet12.service.association.AssociationSearchService;
import com.pgbdev.projet12.service.association.AssociationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/associations")
@RequiredArgsConstructor
public class AssociationController {
    private final AssociationService associationService;
    private final AssociationSearchService associationSearchService;

    @GetMapping("/search")
    public ResponseEntity<Page<AssociationResponse>> search(
            AssociationSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok().body(associationSearchService.searchAssociations(request, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Association> getAssociationById(@PathVariable UUID id) {
        return ResponseEntity.ok().body(associationService.getAssociationById(id));
    }

    @PutMapping("/{id}/tags")
    @PreAuthorize("hasRole('ASSOCIATION') or hasRole('ADMIN')")
    public ResponseEntity<Void> updateTags(
            @PathVariable UUID id,
            @RequestParam List<String> tags
    ) {
        associationService.updateTags(id, tags);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/departments")
    @PreAuthorize("hasRole('ASSOCIATION') or hasRole('ADMIN')")
    public ResponseEntity<Void> updateDepartments(
            @PathVariable UUID id,
            @RequestParam Scope scope,
            @RequestParam(required = false) List<String> departmentCodes,
            @RequestParam(required = false) List<String> regionCodes
    ) {
        associationService.updateDepartments(id, scope, departmentCodes, regionCodes);
        return ResponseEntity.noContent().build();
    }
}
