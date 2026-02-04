package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.Department;
import com.pgbdev.projet12.domain.Region;
import com.pgbdev.projet12.repository.DepartmentRepository;
import com.pgbdev.projet12.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TerritoryService {
    private final DepartmentRepository departmentRepository;
    private final RegionRepository regionRepository;

    public Set<Department> resolveDepartments(Scope scope, List<String> departmentCodes, List<String> regionCodes) {
        return switch (scope) {
            case DEPARTMENTS -> Set.copyOf(departmentRepository.findByCodeIn(departmentCodes));
            case REGIONS -> Set.copyOf(departmentRepository.findByRegion_CodeIn(regionCodes));
            case NATIONAL -> Set.copyOf(departmentRepository.findAll());
        };
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<Region> getAllRegions() {
        return regionRepository.findAll();
    }
}
