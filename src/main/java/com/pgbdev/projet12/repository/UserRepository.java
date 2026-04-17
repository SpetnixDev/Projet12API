package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    @Override
    @EntityGraph(attributePaths = {"subscriptions"})
    Optional<User> findById(UUID id);
}
