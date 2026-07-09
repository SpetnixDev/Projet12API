package com.pgbdev.projet12.dto.response;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record AssociationResponse(
        UUID id,
        String name,
        String description,
        String phoneNumber,
        String contactEmail,
        String address,
        String websiteUrl,
        String rnaNumber,
        String donationUseDescription,
        Instant createdAt,
        Set<TagResponse> tags,
        Set<DepartmentResponse> departments,
        long supportCount
) {}
