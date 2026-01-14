package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.auth.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    /**
     * Finds a RefreshToken by its token value.
     *
     * @param token the token value to search for
     * @return an Optional containing the RefreshToken if found, otherwise empty
     */
    Optional<RefreshToken> findByToken(String token);

    void deleteAllByAuthAccountId(UUID authAccountId);
}
