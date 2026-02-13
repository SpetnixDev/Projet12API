package com.pgbdev.projet12.dto.response;

public record DepartmentResponse(
        String code,
        String name,
        RegionResponse region
) {}
