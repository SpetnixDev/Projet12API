package com.pgbdev.projet12.service.auth;

import com.pgbdev.projet12.domain.auth.AccountType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class JwtService {
    private static final String SECRET_PHRASE = "njdkisqoikhighoirzoknfkdnzakooifdshqiohgiokdnsioqnicvdnsqhgihqgoizer";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_PHRASE.getBytes(StandardCharsets.UTF_8));

    private static final long EXPIRATION_TIME = 60000 * 5;

    public String generateToken(UUID authAccountId, UUID ownerId, AccountType type, List<String> roles) {
        return Jwts.builder()
                .subject(String.valueOf(authAccountId))
                .claim("ownerId", ownerId.toString())
                .claim("type", type.name())
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            validateToken(token);

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public UUID getAuthAccountIdFromToken(String token) {
        return UUID.fromString(validateToken(token).getSubject());
    }

    public UUID getOwnerIdFromToken(String token) {
        return UUID.fromString(validateToken(token).get("ownerId", String.class));
    }

    public AccountType getAccountTypeFromToken(String token) {
        return AccountType.valueOf(validateToken(token).get("type", String.class));
    }

    public List<String> getRolesFromToken(String token) {
        Object rolesObj = validateToken(token).get("roles");

        if (rolesObj instanceof List<?> rolesList) {
            return rolesList.stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .toList();
        }

        return List.of();
    }
}
