package com.pgbdev.projet12.infra.cookie;

import com.pgbdev.projet12.config.properties.TokensProperties;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@Profile("!dev")
@RequiredArgsConstructor
public class DefaultTokenCookieWriter implements TokenCookieWriter {
    private final TokensProperties properties;

    @Override
    public void write(HttpServletResponse response, TokenType type, String token, int maxAge) {
        ResponseCookie cookie;

        switch (type) {
            case ACCESS_TOKEN -> cookie = ResponseCookie.from(properties.atCookieName(), token)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(maxAge)
                    .build();
            case REFRESH_TOKEN -> cookie = ResponseCookie.from(properties.rtCookieName(), token)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(maxAge)
                    .build();
            default -> throw new IllegalArgumentException("Unsupported token type: " + type);
        }

        response.addHeader("Set-Cookie", cookie.toString());
    }
}
