package com.pgbdev.projet12.service.association.search.context;

import com.pgbdev.projet12.service.association.search.preprocessing.TextNormalizer;
import com.pgbdev.projet12.service.association.search.preprocessing.Tokenizer;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class SearchContextTest {
    @Test
    void from_ShouldReturnSearchContext_WhenQueryIsValid() {
        TextNormalizer normalizer = mock(TextNormalizer.class);
        Tokenizer tokenizer = mock(Tokenizer.class);

        String rawQuery = " Recherche  avancée ";
        String normalizedQuery = "recherche avancee";
        var tokens = List.of("recherche", "avancee");

        when(normalizer.normalize(rawQuery)).thenReturn(normalizedQuery);
        when(tokenizer.tokenize(normalizedQuery)).thenReturn(tokens);

        SearchContext context = SearchContext.from(rawQuery, normalizer, tokenizer);

        assertEquals(rawQuery, context.rawQuery());
        assertEquals(normalizedQuery, context.normalizedQuery());
        assertEquals(tokens, context.tokens());

        verify(normalizer).normalize(rawQuery);
        verify(tokenizer).tokenize(normalizedQuery);
    }

    @Test
    void from_ShouldReturnEmptyContext_WhenQueryIsNullOrBlank() {
        TextNormalizer normalizer = mock(TextNormalizer.class);
        Tokenizer tokenizer = mock(Tokenizer.class);

        SearchContext contextNull = SearchContext.from(null, normalizer, tokenizer);
        assertEquals("", contextNull.rawQuery());
        assertEquals("", contextNull.normalizedQuery());
        assertEquals(List.of(), contextNull.tokens());

        SearchContext contextBlank = SearchContext.from("   ", normalizer, tokenizer);
        assertEquals("", contextBlank.rawQuery());
        assertEquals("", contextBlank.normalizedQuery());
        assertEquals(List.of(), contextBlank.tokens());

        verifyNoInteractions(normalizer);
        verifyNoInteractions(tokenizer);
    }
}
