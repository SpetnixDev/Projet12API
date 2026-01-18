package com.pgbdev.projet12.service.association.search.matching;

import com.pgbdev.projet12.service.association.search.context.SearchContext;

public interface FieldMatcher {
    MatchResult match(String fieldValue, SearchContext context);
}
