package com.pgbdev.projet12.service.association.search.preprocessing;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DefaultTokenizerTest {
    private final DefaultTokenizer tokenizer = new DefaultTokenizer();

    @Test
    void tokenize_ShouldReturnEmptyList_WhenInputIsNullOrBlank() {
        assertEquals(List.of(), tokenizer.tokenize(null));
        assertEquals(List.of(), tokenizer.tokenize(" "));
    }

    @Test
    void tokenize_ShouldFilterWordsUnder3Char() {
        assertEquals(List.of("query"), tokenizer.tokenize("query is ok"));
    }

    @Test
    void tokenize_ShouldRemoveStopWords() {
        assertEquals(List.of("query"), tokenizer.tokenize("query et de aux avec par"));
    }

    @Test
    void tokenize_ShouldNotReturnDuplicates() {
        assertEquals(List.of("query", "double", "text"), tokenizer.tokenize("query query double text text text"));
    }
}