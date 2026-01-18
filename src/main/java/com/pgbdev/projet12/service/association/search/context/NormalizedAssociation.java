package com.pgbdev.projet12.service.association.search.context;

import com.pgbdev.projet12.domain.Association;

public record NormalizedAssociation(
    Association association,
    String normalizedName,
    String normalizedDescription
) {}
