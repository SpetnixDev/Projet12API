package com.pgbdev.projet12.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "security.cors")
public record CorsProperties(
        List<String> allowedOrigins
) {}
