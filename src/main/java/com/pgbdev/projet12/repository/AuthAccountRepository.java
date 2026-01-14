package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.auth.AuthAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthAccountRepository extends JpaRepository<AuthAccount, UUID> {
    Optional<AuthAccount> findByEmail(String email);

    boolean existsByEmail(String email);
}
