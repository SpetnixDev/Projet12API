package com.pgbdev.projet12.service.association.search.matching;

import com.pgbdev.projet12.service.association.search.context.SearchContext;
import com.pgbdev.projet12.service.association.search.preprocessing.Tokenizer;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class DefaultFieldMatcherTest {
    @Test
    void match_ShouldReturnNone_WhenFieldIsNullOrBlank() {
        Tokenizer tokenizer = mock(Tokenizer.class);
        DefaultFieldMatcher matcher = new DefaultFieldMatcher(tokenizer);

        SearchContext context = new SearchContext(
                "query",
                "query",
                java.util.List.of("query")
        );

        MatchResult result = matcher.match(null, context);
        assertEquals(MatchType.NONE, result.matchType());

        result = matcher.match("   ", context);
        assertEquals(MatchType.NONE, result.matchType());

        verifyNoInteractions(tokenizer);
    }

    @Test
    void match_ShouldReturnStrictExactMatch_WhenFieldMatchesExactly() {
        Tokenizer tokenizer = mock(Tokenizer.class);
        when(tokenizer.tokenize("query")).thenReturn(List.of("query"));

        DefaultFieldMatcher matcher = new DefaultFieldMatcher(tokenizer);
        SearchContext context = new SearchContext(
                "query",
                "query",
                List.of("query")
        );

        MatchResult result = matcher.match("query", context);

        assertEquals(MatchType.STRICT_EXACT, result.matchType());
        assertEquals(Set.of("query"), result.matchedTokens());
    }

    @Test
    void match_ShouldReturnExactPhraseMatch_WhenFieldContainsExactPhrase() {
        Tokenizer tokenizer = mock(Tokenizer.class);
        when(tokenizer.tokenize("longer query string")).thenReturn(List.of("longer", "query", "string"));

        DefaultFieldMatcher matcher = new DefaultFieldMatcher(tokenizer);

        SearchContext context = new SearchContext(
                "query",
                "query",
                List.of("query")
        );

        MatchResult result = matcher.match("longer query string", context);
        assertEquals(MatchType.EXACT_PHRASE, result.matchType());
        assertEquals(Set.of("query"), result.matchedTokens());
    }

    @Test
    void match_ShouldReturnContainsMatch_WhenFieldTokensContainTokens() {
        Tokenizer tokenizer = mock(Tokenizer.class);
        when(tokenizer.tokenize("some random query text")).thenReturn(List.of("some", "random", "query", "text"));

        DefaultFieldMatcher matcher = new DefaultFieldMatcher(tokenizer);

        SearchContext context = new SearchContext(
                "longer query text",
                "longer query text",
                List.of("longer", "query", "text")
        );

        MatchResult result = matcher.match("some random query text", context);
        assertEquals(MatchType.CONTAINS, result.matchType());
        assertEquals(Set.of("query", "text"), result.matchedTokens());
    }

    @Test
    void match_ShouldReturnPrefixMatch_WhenFieldTokensMatchPrefix() {
        Tokenizer tokenizer = mock(Tokenizer.class);
        when(tokenizer.tokenize("querying data")).thenReturn(List.of("querying", "data"));

        DefaultFieldMatcher matcher = new DefaultFieldMatcher(tokenizer);

        SearchContext context = new SearchContext(
                "query string",
                "query string",
                List.of("query", "string")
        );

        MatchResult result = matcher.match("querying data", context);
        assertEquals(MatchType.PREFIX, result.matchType());
        assertEquals(Set.of("query"), result.matchedTokens());
    }

    @Test
    void match_ShouldReturnNone_WhenNoMatchFound() {
        Tokenizer tokenizer = mock(Tokenizer.class);
        when(tokenizer.tokenize("unrelated text")).thenReturn(List.of("unrelated", "text"));

        DefaultFieldMatcher matcher = new DefaultFieldMatcher(tokenizer);

        SearchContext context = new SearchContext(
                "query",
                "query",
                List.of("query")
        );

        MatchResult result = matcher.match("unrelated text", context);
        assertEquals(MatchType.NONE, result.matchType());
    }
}