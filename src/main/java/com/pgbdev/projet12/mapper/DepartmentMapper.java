package com.pgbdev.projet12.mapper;

import com.pgbdev.projet12.domain.Department;
import com.pgbdev.projet12.dto.response.DepartmentResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = RegionMapper.class)
public interface DepartmentMapper {
    DepartmentResponse toResponse(Department department);

    List<DepartmentResponse> toResponseList(List<Department> departments);
}
