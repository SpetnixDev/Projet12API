package com.pgbdev.projet12.dto.response;

import com.pgbdev.projet12.domain.Department;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record AssociationResponse(
        UUID id,
        String name,
        String description,
        Instant createdAt,
        Set<TagResponse> tags,
        Set<Department> departments
) {}
