package com.pgbdev.projet12.service.auth;

import com.pgbdev.projet12.config.properties.TokensProperties;
import com.pgbdev.projet12.domain.auth.AuthAccount;
import com.pgbdev.projet12.domain.auth.RefreshToken;
import com.pgbdev.projet12.infra.cookie.TokenCookieWriter;
import com.pgbdev.projet12.infra.cookie.TokenType;
import com.pgbdev.projet12.repository.RefreshTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {
    private final TokensProperties tokensProperties;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenCookieWriter tokenCookieWriter;

    public RefreshToken create(AuthAccount authAccount, HttpServletRequest request, String deviceId) {
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .authAccount(authAccount)
                .ipAddress(ip)
                .userAgent(userAgent)
                .deviceId(deviceId)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(tokensProperties.rtExpiration()))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public void revoke(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshToken -> {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
        });
    }

    @Transactional
    public Optional<RefreshToken> rotate(String token, HttpServletRequest request) {
        Optional<RefreshToken> existingTokenOpt = refreshTokenRepository.findByToken(token);

        if (existingTokenOpt.isEmpty()) return Optional.empty();

        RefreshToken existingToken = existingTokenOpt.get();

        if (existingToken.isInactive()) return Optional.empty();

        String currentIp = request.getRemoteAddr();
        String currentUserAgent = request.getHeader("User-Agent");

        if (!existingToken.getIpAddress().equals(currentIp) ||
            !existingToken.getUserAgent().equals(currentUserAgent)) {
            return Optional.empty();
        }

        existingToken.setRevoked(true);

        RefreshToken newToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .authAccount(existingToken.getAuthAccount())
                .ipAddress(currentIp)
                .userAgent(currentUserAgent)
                .deviceId(existingToken.getDeviceId())
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(tokensProperties.rtExpiration()))
                .revoked(false)
                .replacedBy(null)
                .build();

        refreshTokenRepository.save(newToken);

        existingToken.setReplacedBy(newToken);

        refreshTokenRepository.save(existingToken);

        return Optional.of(newToken);
    }

    public void setRefreshTokenCookie(HttpServletResponse response, String token, int maxAge) {
        tokenCookieWriter.write(response, TokenType.REFRESH_TOKEN, token, maxAge);
    }

    public void deleteAllForAuthAccount(UUID authAccountId) {
        refreshTokenRepository.deleteAllByAuthAccountId(authAccountId);
    }
}
