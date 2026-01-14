package com.pgbdev.projet12.service.auth;

import com.pgbdev.projet12.config.properties.RefreshTokenProperties;
import com.pgbdev.projet12.dto.LoginRequest;
import com.pgbdev.projet12.dto.RegisterRequest;
import com.pgbdev.projet12.domain.auth.RefreshToken;
import com.pgbdev.projet12.domain.auth.Role;
import com.pgbdev.projet12.domain.auth.User;
import com.pgbdev.projet12.repository.RoleRepository;
import com.pgbdev.projet12.service.UserService;
import com.pgbdev.projet12.technical.exception.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final RefreshTokenProperties refreshTokenProperties;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public ResponseEntity<String> register(RegisterRequest registerRequest) {
        String email = registerRequest.getEmail();
        Optional<User> existingUser = userService.findByEmail(email);

        if (existingUser.isPresent()) {
            throw new DuplicateResourceException(User.class, "email", email, "Email already registered.");
        }

        String hashPassword = BCrypt.hashpw(registerRequest.getPassword(), BCrypt.gensalt(12));

        final String baseRole = "ROLE_USER";
        Role userRole = roleRepository.findByName(baseRole).orElseThrow(() -> new ResourceNotFoundException(Role.class, "name", baseRole, "An unexpected error occurred."));
        User newUser = new User(email, registerRequest.getUsername(), hashPassword);

        Set<Role> roles = Set.of(userRole);
        newUser.setRoles(roles);

        User savedUser = userService.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully with ID: " + savedUser.getId());
    }

    @Transactional
    public ResponseEntity<?> login(LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty() || !BCrypt.checkpw(loginRequest.getPassword(), userOpt.get().getPassword())) {
            throw new AuthenticationException("Invalid credentials.");
        }

        User user = userOpt.get();

        if (!user.isEnabled()) {
            throw new AuthenticationException("Your account is disabled.");
        }

        List<String> roles = userService.getUserRoles(user.getId());

        RefreshToken refreshToken = refreshTokenService.create(user, request, "default");
        refreshTokenService.setRefreshTokenCookie(response, refreshToken.getToken(), refreshTokenProperties.expiration());

        String accessToken = jwtService.generateToken(user.getId(), roles);

        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractTokenFromCookie(request);

        if (refreshToken == null) {
            throw new RefreshTokenAuthException("Token not found", "Session expired. Please log in again.");
        }

        Optional<RefreshToken> newTokenOpt = refreshTokenService.rotate(refreshToken, request);

        if (newTokenOpt.isEmpty()) {
            throw new RefreshTokenAuthException(String.format("[%s...] Token invalid or expired", refreshToken.substring(0, 12)), "Session expired. Please log in again.");
        }

        RefreshToken newToken = newTokenOpt.get();
        refreshTokenService.setRefreshTokenCookie(response, newToken.getToken(), refreshTokenProperties.expiration());

        UUID userId = newToken.getUser().getId();
        List<String> roles = userService.getUserRoles(userId);

        String accessToken = jwtService.generateToken(userId, roles);

        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractTokenFromCookie(request);

        if (refreshToken != null) {
            refreshTokenService.revoke(refreshToken);
        }

        refreshTokenService.setRefreshTokenCookie(response, "", 0);

        return ResponseEntity.ok("You successfully logged out.");
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if (refreshTokenProperties.cookieName().equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}
