package com.pgbdev.projet12.service.association.search.preprocessing;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
public class DefaultTokenizer implements Tokenizer {
    private static final Set<String> STOPWORDS = Set.of(
            "et", "de", "des", "du", "la", "le", "les",
            "un", "une", "au", "aux", "en", "pour", "avec",
            "sur", "dans", "par"
    );

    private static final int MIN_LENGTH = 3;

    @Override
    public List<String> tokenize(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        return Arrays.stream(text.split(" "))
                .filter(token -> token.length() >= MIN_LENGTH)
                .filter(token -> !STOPWORDS.contains(token))
                .distinct()
                .toList();
    }
}

