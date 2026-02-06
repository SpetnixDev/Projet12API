package com.pgbdev.projet12.dto.request;

import java.util.List;

public record AssociationSearchRequest(
        String query,
        List<String> tags,
        List<String> departments
) {}
