package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.Department;
import com.pgbdev.projet12.dto.response.DepartmentResponse;
import com.pgbdev.projet12.dto.response.RegionResponse;
import com.pgbdev.projet12.mapper.DepartmentMapper;
import com.pgbdev.projet12.mapper.RegionMapper;
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
    private final DepartmentMapper departmentMapper;
    private final RegionRepository regionRepository;
    private final RegionMapper regionMapper;

    public Set<Department> resolveDepartments(Scope scope, List<String> departmentCodes, List<String> regionCodes) {
        return switch (scope) {
            case DEPARTMENTS -> Set.copyOf(departmentRepository.findByCodeIn(departmentCodes));
            case REGIONS -> Set.copyOf(departmentRepository.findByRegion_CodeIn(regionCodes));
            case NATIONAL -> Set.copyOf(departmentRepository.findAll());
        };
    }

    public List<DepartmentResponse> getAllDepartments() {
        return departmentMapper.toResponseList(departmentRepository.findAll());
    }

    public List<RegionResponse> getAllRegions() {
        return regionMapper.toResponseList(regionRepository.findAll());
    }
}
