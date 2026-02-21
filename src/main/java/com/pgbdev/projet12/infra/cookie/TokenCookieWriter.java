package com.pgbdev.projet12.infra.cookie;

import jakarta.servlet.http.HttpServletResponse;

public interface TokenCookieWriter {
    void write(HttpServletResponse response, TokenType type, String token, int maxAge);
}
