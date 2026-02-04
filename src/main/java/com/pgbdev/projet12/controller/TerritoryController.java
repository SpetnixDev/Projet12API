package com.pgbdev.projet12.controller;

import com.pgbdev.projet12.domain.Department;
import com.pgbdev.projet12.domain.Region;
import com.pgbdev.projet12.service.TerritoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/territories")
@RequiredArgsConstructor
public class TerritoryController {
    private final TerritoryService territoryService;

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(territoryService.getAllDepartments());
    }

    @GetMapping("/regions")
    public ResponseEntity<List<Region>> getAllRegions() {
        return ResponseEntity.ok(territoryService.getAllRegions());
    }
}
