package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.auth.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Finds a role by its name (e.g., ROLE_USER).
     *
     * @param name the name of the role to find
     * @return an Optional containing the Role if found, otherwise empty
     */
    Optional<Role> findByName(String name);
}
