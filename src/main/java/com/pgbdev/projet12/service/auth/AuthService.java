package com.pgbdev.projet12.service.auth;

import com.pgbdev.projet12.config.properties.RefreshTokenProperties;
import com.pgbdev.projet12.domain.auth.*;
import com.pgbdev.projet12.dto.LoginRequest;
import com.pgbdev.projet12.dto.RegisterRequest;
import com.pgbdev.projet12.repository.AuthAccountRepository;
import com.pgbdev.projet12.repository.RoleRepository;
import com.pgbdev.projet12.service.AssociationService;
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
    private final AuthAccountService authAccountService;
    private final AuthAccountRepository authAccountRepository;

    private final UserService userService;
    private final AssociationService associationService;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    @Transactional
    public Map<String, String> register(AccountType type, RegisterRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        if (authAccountRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    AuthAccount.class,
                    "email",
                    request.getEmail(),
                    "Email already registered"
            );
        }

        String passwordHash = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        UUID ownerId;

        switch (type) {
            case USER -> {
                User user = userService.create(request.getName());
                ownerId = user.getId();
            }
            case ASSOCIATION -> {
                Association association = associationService.create(request.getName());
                ownerId = association.getId();
            }
            default -> throw new IllegalStateException("Unsupported account type");
        }

        Set<Role> roles = defaultRolesFor(type);

        AuthAccount account = authAccountService.create(
                request.getEmail(),
                passwordHash,
                type,
                ownerId,
                roles
        );

        RefreshToken refreshToken = refreshTokenService.create(account, httpRequest, "default");
        refreshTokenService.setRefreshTokenCookie(httpResponse, refreshToken.getToken(), refreshTokenProperties.expiration());

        String accessToken = jwtService.generateToken(
                account.getId(),
                account.getOwnerId(),
                account.getType(),
                account.getRoles().stream()
                        .map(Role::getName)
                        .toList()
        );

        return Map.of("accessToken", accessToken);
    }


    @Transactional
    public Map<String, String> login(LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        AuthAccount account = authAccountService.authenticate(request.getEmail(), request.getPassword());
        RefreshToken refreshToken = refreshTokenService.create(account, httpRequest, "default");

        refreshTokenService.setRefreshTokenCookie(httpResponse, refreshToken.getToken(), refreshTokenProperties.expiration());

        String accessToken = jwtService.generateToken(
                account.getId(),
                account.getOwnerId(),
                account.getType(),
                account.getRoles().stream()
                        .map(Role::getName)
                        .toList()
        );

        return Map.of("accessToken", accessToken);
    }

    @Transactional
    public Map<String, String> refresh(HttpServletRequest request, HttpServletResponse response) {
        String token = extractTokenFromCookie(request);

        if (token == null) {
            throw new RefreshTokenAuthException("Token missing", "Session expired, please login again");
        }

        RefreshToken newToken = refreshTokenService.rotate(token, request)
                .orElseThrow(() -> new RefreshTokenAuthException("Token invalid", "Session expired, please login again"));

        refreshTokenService.setRefreshTokenCookie(response, newToken.getToken(), refreshTokenProperties.expiration());

        AuthAccount account = newToken.getAuthAccount();

        String accessToken = jwtService.generateToken(
                account.getId(),
                account.getOwnerId(),
                account.getType(),
                account.getRoles().stream()
                        .map(Role::getName)
                        .toList()
        );

        return Map.of("accessToken", accessToken);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractTokenFromCookie(request);

        if (token != null) refreshTokenService.revoke(token);

        refreshTokenService.setRefreshTokenCookie(response, "", 0);
    }

    private Set<Role> defaultRolesFor(AccountType type) {
        String baseRoleName = switch (type) {
            case USER -> "ROLE_USER";
            case ASSOCIATION -> "ROLE_ASSOCIATION";
        };

        Role baseRole = roleRepository.findByName(baseRoleName).orElseThrow(() -> new IllegalStateException("Role not found: " + baseRoleName));

        Role unverifiedRole = roleRepository.findByName("ROLE_UNVERIFIED").orElseThrow(() -> new IllegalStateException("Role not found: ROLE_UNVERIFIED"));

        return Set.of(baseRole, unverifiedRole);
    }


    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (var cookie : request.getCookies()) {
            if (refreshTokenProperties.cookieName().equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
