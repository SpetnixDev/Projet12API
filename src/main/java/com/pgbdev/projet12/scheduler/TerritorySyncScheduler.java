package com.pgbdev.projet12.scheduler;

import com.pgbdev.projet12.service.TerritorySyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableScheduling
public class TerritorySyncScheduler {
    private final TerritorySyncService territorySyncService;

    @Scheduled(cron = "0 0 0 1 * *")
    public void syncTerritories() {
        territorySyncService.syncTerritories();
    }
}
