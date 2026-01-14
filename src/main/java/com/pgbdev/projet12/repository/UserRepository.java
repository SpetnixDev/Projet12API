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
     * Finds a user by their email.
     *
     * @param email the email of the user
     * @return an Optional containing the User if found, otherwise empty
     */
    Optional<User> findByEmail(String email);

    /**
     * Deletes a user by their ID.
     *
     * @param id the ID of the user to delete
     */
    void deleteById(UUID id);

    /**
     * Finds a username by user ID.
     *
     * @param userId the ID of the user
     * @return an Optional containing the username if found, otherwise empty
     */
    @Query("SELECT u.username FROM User u WHERE u.id = :userId")
    Optional<String> findUsernameByUserId(@Param("userId") UUID userId);

    /**
     * Finds role names associated with a user by their ID.
     *
     * @param userId the ID of the user
     * @return an Optional containing the role names if found, otherwise empty
     */
    @Query("SELECT r.name FROM User u JOIN u.roles r WHERE u.id = :id")
    List<String> findRoleNamesByUserId(@Param("id") UUID userId);
}
