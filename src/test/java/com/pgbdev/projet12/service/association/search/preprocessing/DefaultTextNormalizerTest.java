package com.pgbdev.projet12.service.association.search.preprocessing;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DefaultTextNormalizerTest {
    private final DefaultTextNormalizer normalizer = new DefaultTextNormalizer();

    @Test
    void normalize_ShouldReturnEmptyString_WhenInputIsNull() {
        assertEquals("", normalizer.normalize(null));
    }

    @Test
    void normalize_ShouldReturnEmptyString_WhenInputIsBlankOrOnlySpaces() {
        assertEquals("", normalizer.normalize(""));
        assertEquals("", normalizer.normalize("   \t  \n "));
    }

    @Test
    void normalize_ShouldLowercase_AndTrim_AndCollapseSpaces() {
        assertEquals("test long query", normalizer.normalize("  TEST Long    Query  "));
    }

    @Test
    void normalize_ShouldRemoveDiacritics() {
        assertEquals("test a l aide d un texte accentue", normalizer.normalize("Test à l'aide d'un texte accentué"));
    }

    @Test
    void normalize_ShouldReplacePunctuationWithSpaces_AndCollapse() {
        assertEquals("test query", normalizer.normalize("Test,\nquery!!"));
    }

    @Test
    void normalize_ShouldKeepDigits() {
        assertEquals("test query 123", normalizer.normalize("Test Query 123"));
    }

    @Test
    void normalize_ShouldRemoveNonAlnumExceptSpaces() {
        assertEquals("test a l aide d un texte comprenant tous les types de caracteres indesirables", normalizer.normalize("Test, à l'aide d'un texte, comprenant, tous les types de caractères indésirables!   * "));
    }

    @Test
    void normalize_ShouldHandleMixedCharacters() {
        assertEquals("test query with mixed characters", normalizer.normalize("Test@# Query$$ with%%^\u00A0 mixed&&*() characters!!"));
    }
}