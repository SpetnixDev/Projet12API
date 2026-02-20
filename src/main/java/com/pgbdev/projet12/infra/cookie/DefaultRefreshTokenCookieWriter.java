package com.pgbdev.projet12.infra.cookie;

import com.pgbdev.projet12.config.properties.RefreshTokenProperties;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@Profile("!dev")
@RequiredArgsConstructor
public class DefaultRefreshTokenCookieWriter implements RefreshTokenCookieWriter {
    private final RefreshTokenProperties properties;

    @Override
    public void write(HttpServletResponse response, String token, int maxAge) {
        ResponseCookie cookie = ResponseCookie.from(properties.cookieName(), token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(maxAge)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }
}
