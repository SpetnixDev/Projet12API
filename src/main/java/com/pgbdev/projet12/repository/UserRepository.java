package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    /**
     * Deletes a user by their ID.
     *
     * @param id the ID of the user to delete
     */
    void deleteById(UUID id);
}
