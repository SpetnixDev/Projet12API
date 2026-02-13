package com.pgbdev.projet12.controller;

import com.pgbdev.projet12.dto.response.DepartmentResponse;
import com.pgbdev.projet12.dto.response.RegionResponse;
import com.pgbdev.projet12.service.TerritoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/territories")
@RequiredArgsConstructor
public class TerritoryController {
    private final TerritoryService territoryService;

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(territoryService.getAllDepartments());
    }

    @GetMapping("/regions")
    public ResponseEntity<List<RegionResponse>> getAllRegions() {
        return ResponseEntity.ok(territoryService.getAllRegions());
    }
}
