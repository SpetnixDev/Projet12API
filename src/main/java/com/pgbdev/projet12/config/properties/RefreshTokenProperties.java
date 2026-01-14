package com.pgbdev.projet12.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "api.refresh-token")
public record RefreshTokenProperties(
        String cookieName,
        int expiration
) {}
