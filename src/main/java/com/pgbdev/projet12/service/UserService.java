package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.auth.User;
import com.pgbdev.projet12.repository.UserRepository;
import com.pgbdev.projet12.service.auth.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User newUser) {
        return userRepository.save(newUser);
    }

    /**
     * Deletes a user by their ID and revokes all associated refresh tokens.
     *
     * @param userId the ID of the user to delete
     */
    @Transactional
    public void deleteUser(UUID userId) {
        refreshTokenService.deleteAllForUser(userId);
        userRepository.deleteById(userId);
    }

    @Transactional(readOnly = true)
    public List<String> getUserRoles(UUID userId) {
        return userRepository.findRoleNamesByUserId(userId);
    }
}
