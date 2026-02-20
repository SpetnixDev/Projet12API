package com.pgbdev.projet12.infra.cookie;

import jakarta.servlet.http.HttpServletResponse;

public interface RefreshTokenCookieWriter {
    void write(HttpServletResponse response, String token, int maxAge);
}
