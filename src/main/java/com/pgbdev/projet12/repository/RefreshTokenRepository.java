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

    /**
     * Finds all active RefreshTokens for a given user.
     *
     * @param userId the ID of the user
     * @return a List of active RefreshTokens for the user
     */
    List<RefreshToken> findAllByUserIdAndRevokedFalse(UUID userId);

    /**
     * Deletes all RefreshTokens associated with a user (used for complete logout).
     *
     * @param userId the ID of the user whose tokens should be deleted
     */
    void deleteAllByUserId(UUID userId);
}
