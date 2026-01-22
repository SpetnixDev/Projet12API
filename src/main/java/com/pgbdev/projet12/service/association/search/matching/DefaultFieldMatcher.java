package com.pgbdev.projet12.service.association.search.matching;

import com.pgbdev.projet12.service.association.search.context.SearchContext;
import com.pgbdev.projet12.service.association.search.preprocessing.Tokenizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DefaultFieldMatcher implements FieldMatcher {
    private final Tokenizer tokenizer;

    private static final List<MatchType> ORDER = List.of(
            MatchType.STRICT_EXACT,
            MatchType.EXACT_PHRASE,
            MatchType.CONTAINS,
            MatchType.PREFIX
    );

    @Override
    public MatchResult match(String field, SearchContext context) {
        if (field == null || field.isBlank()) {
            return MatchResult.none();
        }

        List<String> fieldTokens = tokenizer.tokenize(field);

        for (MatchType matchType : ORDER) {
            MatchResult result = switch (matchType) {
                case STRICT_EXACT -> strictExactMatch(field, context);
                case EXACT_PHRASE -> exactPhraseMatch(field, context);
                case CONTAINS -> containsMatch(fieldTokens, context);
                case PREFIX -> prefixMatch(fieldTokens, context);
                default -> throw new IllegalStateException("Unexpected value: " + matchType);
            };

            if (result.matchType() != MatchType.NONE) {
                return result;
            }
        }

        return MatchResult.none();
    }

    private MatchResult strictExactMatch(String field, SearchContext context) {
        if (field.equals(context.normalizedQuery())) {
            return new MatchResult(MatchType.STRICT_EXACT, Set.copyOf(context.tokens()));
        }

        return MatchResult.none();
    }

    private MatchResult exactPhraseMatch(String field, SearchContext context) {
        if (field.contains(context.normalizedQuery())) {
            return new MatchResult(MatchType.EXACT_PHRASE, Set.copyOf(context.tokens()));
        }

        return MatchResult.none();
    }

    private MatchResult containsMatch(List<String> fieldTokens, SearchContext context) {
        Set<String> matchedTokens = context.tokens().stream()
                .filter(fieldTokens::contains)
                .collect(Collectors.toSet());

        if (!matchedTokens.isEmpty()) {
            return new MatchResult(MatchType.CONTAINS, matchedTokens);
        }

        return MatchResult.none();
    }

    private MatchResult prefixMatch(List<String> fieldTokens, SearchContext context) {
        Set<String> matchedTokens = context.tokens().stream()
                .filter(token -> fieldTokens.stream().anyMatch(ft -> ft.startsWith(token)))
                .collect(Collectors.toSet());

        if (!matchedTokens.isEmpty()) {
            return new MatchResult(MatchType.PREFIX, matchedTokens);
        }

        return MatchResult.none();
    }
}
