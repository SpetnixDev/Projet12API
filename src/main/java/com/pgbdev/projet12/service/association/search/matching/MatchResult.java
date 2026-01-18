package com.pgbdev.projet12.service.association.search.matching;

import java.util.Set;

public record MatchResult(
        MatchType matchType,
        Set<String> matchedTokens
) {
    public static MatchResult none() {
        return new MatchResult(MatchType.NONE, Set.of());
    }
}
