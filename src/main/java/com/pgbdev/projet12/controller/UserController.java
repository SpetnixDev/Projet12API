package com.pgbdev.projet12.controller;

import com.pgbdev.projet12.dto.response.AssociationResponse;
import com.pgbdev.projet12.dto.response.UserResponse;
import com.pgbdev.projet12.security.AuthPrincipal;
import com.pgbdev.projet12.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponse> getMe(
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return ResponseEntity.ok(userService.getById(principal.ownerId()));
    }

    @PostMapping("/me/subscriptions/{associationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> subscribe(
            @AuthenticationPrincipal AuthPrincipal principal,
            @PathVariable UUID associationId
    ) {
        userService.subscribe(principal.ownerId(), associationId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me/subscriptions/{associationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unsubscribe(
            @AuthenticationPrincipal AuthPrincipal principal,
            @PathVariable UUID associationId
    ) {
        userService.unsubscribe(principal.ownerId(), associationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/subscriptions")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AssociationResponse>> getMySubscriptions(
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return ResponseEntity.ok(userService.getSubscriptions(principal.ownerId()));
    }

    @PostMapping("/me/supports/{associationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> support(
            @AuthenticationPrincipal AuthPrincipal principal,
            @PathVariable UUID associationId
    ) {
        userService.support(principal.ownerId(), associationId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me/supports/{associationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> unsupport(
            @AuthenticationPrincipal AuthPrincipal principal,
            @PathVariable UUID associationId
    ) {
        userService.unsupport(principal.ownerId(), associationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/supports")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AssociationResponse>> getMySupports(
            @AuthenticationPrincipal AuthPrincipal principal
    ) {
        return ResponseEntity.ok(userService.getSupports(principal.ownerId()));
    }
}
