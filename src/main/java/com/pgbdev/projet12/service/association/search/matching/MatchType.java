package com.pgbdev.projet12.service.association.search.matching;

import lombok.Getter;

@Getter
public enum MatchType {
    STRICT_EXACT(1000),
    EXACT_PHRASE(500),
    CONTAINS (200),
    PREFIX (100),
    NONE (0);

    private final int score;

    MatchType(int score) {
        this.score = score;
    }
}
