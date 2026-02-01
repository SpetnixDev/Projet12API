package com.pgbdev.projet12.controller;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.dto.request.AssociationSearchRequest;
import com.pgbdev.projet12.dto.response.AssociationResponse;
import com.pgbdev.projet12.service.association.AssociationSearchService;
import com.pgbdev.projet12.service.association.AssociationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Association> getAssociationById(@PathVariable UUID id) {
        return ResponseEntity.ok().body(associationService.getAssociationById(id));
    }
}
