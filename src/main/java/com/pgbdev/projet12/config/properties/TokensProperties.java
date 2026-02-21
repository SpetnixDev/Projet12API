package com.pgbdev.projet12.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "api.tokens")
public record TokensProperties(
        String rtCookieName,
        int rtExpiration,
        String atCookieName,
        int atExpiration
) {}
