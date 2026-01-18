package com.pgbdev.projet12.service.association.search.context;

import com.pgbdev.projet12.service.association.search.preprocessing.TextNormalizer;
import com.pgbdev.projet12.service.association.search.preprocessing.Tokenizer;

import java.util.List;

public record SearchContext(
    String rawQuery,
    String normalizedQuery,
    List<String> tokens
) {
    public static SearchContext from(String rawQuery, TextNormalizer normalizer, Tokenizer tokenizer) {
        if (rawQuery == null || rawQuery.isBlank()) {
            return new SearchContext("", "", List.of());
        }

        String normalizedQuery = normalizer.normalize(rawQuery);
        List<String> tokens = tokenizer.tokenize(normalizedQuery);

        return new SearchContext(rawQuery, normalizedQuery, tokens);
    }
}
