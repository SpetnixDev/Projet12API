package com.pgbdev.projet12.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({
        com.pgbdev.projet12.config.properties.CorsProperties.class,
        com.pgbdev.projet12.config.properties.GeoApiProperties.class,
        com.pgbdev.projet12.config.properties.RefreshTokenProperties.class
})
public class AppConfig {
}
