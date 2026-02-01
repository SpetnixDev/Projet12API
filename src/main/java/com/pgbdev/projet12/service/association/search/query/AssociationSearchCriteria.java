package com.pgbdev.projet12.service.association.search.query;

import java.util.List;

public record AssociationSearchCriteria(
        String query,
        List<Long> tags
) {}
