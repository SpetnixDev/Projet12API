package com.pgbdev.projet12.controller;

import com.pgbdev.projet12.dto.request.AssociationSearchRequest;
import com.pgbdev.projet12.dto.response.AssociationResponse;
import com.pgbdev.projet12.dto.response.PageResponse;
import com.pgbdev.projet12.domain.auth.AccountType;
import com.pgbdev.projet12.security.AuthPrincipal;
import com.pgbdev.projet12.service.Scope;
import com.pgbdev.projet12.service.association.AssociationSearchService;
import com.pgbdev.projet12.service.association.AssociationService;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/associations")
@RequiredArgsConstructor
@Validated
public class AssociationController {
    private final AssociationService associationService;
    private final AssociationSearchService associationSearchService;

    @GetMapping("/search")
    public ResponseEntity<PageResponse<AssociationResponse>> search(
            AssociationSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok().body(associationSearchService.searchAssociations(request, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssociationResponse> getAssociationById(@PathVariable UUID id) {
        return ResponseEntity.ok().body(associationService.getAssociationById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ASSOCIATION')")
    public ResponseEntity<AssociationResponse> getMe(
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return ResponseEntity.ok().body(associationService.getAssociationById(principal.ownerId()));
    }

    @PutMapping("/{id}/tags")
    @PreAuthorize("hasRole('ASSOCIATION') or hasRole('ADMIN')")
    public ResponseEntity<Void> updateTags(
            @AuthenticationPrincipal AuthPrincipal principal,
            @PathVariable UUID id,
            @RequestParam List<String> tags
    ) {
        checkCanManageAssociation(id, principal);
        associationService.updateTags(id, tags);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/description")
    @PreAuthorize("hasRole('ASSOCIATION') or hasRole('ADMIN')")
    public ResponseEntity<Void> updateDescription(
            @AuthenticationPrincipal AuthPrincipal principal,
            @PathVariable UUID id,
            @RequestParam @Size(max = 2000) String description
    ) {
        checkCanManageAssociation(id, principal);
        associationService.updateDescription(id, description);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/departments")
    @PreAuthorize("hasRole('ASSOCIATION') or hasRole('ADMIN')")
    public ResponseEntity<Void> updateDepartments(
            @AuthenticationPrincipal AuthPrincipal principal,
            @PathVariable UUID id,
            @RequestParam Scope scope,
            @RequestParam(required = false) List<String> departmentCodes,
            @RequestParam(required = false) List<String> regionCodes
    ) {
        checkCanManageAssociation(id, principal);
        associationService.updateDepartments(id, scope, departmentCodes, regionCodes);
        return ResponseEntity.noContent().build();
    }

    private void checkCanManageAssociation(UUID associationId, AuthPrincipal principal) {
        boolean isAssociationOwner = principal.type() == AccountType.ASSOCIATION
                && principal.ownerId().equals(associationId);

        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !isAssociationOwner) {
            throw new AccessDeniedException("Vous ne pouvez pas modifier cette association.");
        }
    }
}
