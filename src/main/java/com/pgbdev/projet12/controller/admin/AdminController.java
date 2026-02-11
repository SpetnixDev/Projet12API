package com.pgbdev.projet12.controller.admin;

import com.pgbdev.projet12.service.TerritorySyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final TerritorySyncService territorySyncService;

    @PostMapping("/territories/sync")
    public ResponseEntity<Void> syncTerritories() {
        territorySyncService.syncTerritories();
        return ResponseEntity.accepted().build();
    }
}
