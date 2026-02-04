package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    List<Department> findByCodeIn(List<String> departmentCodes);

    List<Department> findByRegion_CodeIn(List<String> regionCodes);
}
