package com.pgbdev.projet12.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "api.jwt")
public record SecurityProperties(
        String secret
) {
}
