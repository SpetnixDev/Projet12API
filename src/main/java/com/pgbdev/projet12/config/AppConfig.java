package com.pgbdev.projet12.config;

import com.pgbdev.projet12.config.properties.CorsProperties;
import com.pgbdev.projet12.config.properties.GeoApiProperties;
import com.pgbdev.projet12.config.properties.SecurityProperties;
import com.pgbdev.projet12.config.properties.TokensProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({
        CorsProperties.class,
        GeoApiProperties.class,
        TokensProperties.class,
        SecurityProperties.class
})
public class AppConfig {
}
