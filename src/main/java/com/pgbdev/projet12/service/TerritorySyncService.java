package com.pgbdev.projet12.service;

import com.pgbdev.projet12.config.client.GeoApiGouvClient;
import com.pgbdev.projet12.domain.Department;
import com.pgbdev.projet12.domain.Region;
import com.pgbdev.projet12.dto.response.external.DepartmentExternalResponse;
import com.pgbdev.projet12.dto.response.external.RegionExternalResponse;
import com.pgbdev.projet12.repository.DepartmentRepository;
import com.pgbdev.projet12.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TerritorySyncService {
    private final GeoApiGouvClient client;
    private final RegionRepository regionRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public void syncTerritories() {
        List<RegionExternalResponse> externalRegions = client.fetchRegions();
        Map<String, Region> existingRegions = regionRepository.findAll().stream()
                .collect(Collectors.toMap(Region::getCode, Function.identity()));

        for (RegionExternalResponse externalRegion : externalRegions) {
            Region region = existingRegions.get(externalRegion.code());

            if (region == null) {
                region = new Region();
                region.setCode(externalRegion.code());
            }

            region.setName(externalRegion.nom());
            regionRepository.save(region);
        }

        List<DepartmentExternalResponse> externalDepartments = client.fetchDepartments();
        Map<String, Department> existingDepartments = departmentRepository.findAll().stream()
                .collect(Collectors.toMap(Department::getCode, Function.identity()));
        Map<String, Region> regionMap = regionRepository.findAll().stream()
                .collect(Collectors.toMap(Region::getCode, Function.identity()));

        for (DepartmentExternalResponse externalDepartment : externalDepartments) {
            Department department = existingDepartments.get(externalDepartment.code());

            if (department == null) {
                department = new Department();
                department.setCode(externalDepartment.code());
            }

            department.setName(externalDepartment.nom());

            Region region = regionMap.get(externalDepartment.codeRegion());

            if (region == null) {
                throw new IllegalStateException("No region found with code " + externalDepartment.codeRegion());
            }

            department.setRegion(region);
            departmentRepository.save(department);
        }
    }
}
