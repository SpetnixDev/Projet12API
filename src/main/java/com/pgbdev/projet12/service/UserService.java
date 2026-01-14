package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.auth.User;
import com.pgbdev.projet12.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User create(String username) {
        User user = new User(username);
        return userRepository.save(user);
    }

    @Transactional
    public void delete(UUID userId) {
        userRepository.deleteById(userId);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }
}

