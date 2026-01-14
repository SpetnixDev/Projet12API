package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.auth.Association;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AssociationRepository extends JpaRepository<Association, UUID> {
    void deleteById(UUID id);
}
