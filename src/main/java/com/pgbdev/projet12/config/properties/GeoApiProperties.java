package com.pgbdev.projet12.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "geo.api")
public record GeoApiProperties(
        String baseUrl
) {}
