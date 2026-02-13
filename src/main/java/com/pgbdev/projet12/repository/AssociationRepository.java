package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.Association;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssociationRepository extends JpaRepository<Association, UUID>, JpaSpecificationExecutor<Association> {
    @EntityGraph(attributePaths = {"tags", "departments", "departments.region"})
    List<Association> findAll(Specification<Association> spec);
}
