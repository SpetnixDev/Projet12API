package com.pgbdev.projet12.service.association.search.matching;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.service.association.search.context.NormalizedAssociation;
import com.pgbdev.projet12.service.association.search.context.SearchContext;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class SearchResultScorerTest {
    @Test
    void scoreAndSortResults_ShouldReturnEmptyList_WhenAllScoresAreZero() {
        FieldMatcher fieldMatcher = mock(FieldMatcher.class);
        SearchResultScorer scorer = new SearchResultScorer(fieldMatcher);

        SearchContext context = mock(SearchContext.class);

        NormalizedAssociation candidate = new NormalizedAssociation(
                new Association(),
                "name",
                "description"
        );

        when(fieldMatcher.match(any(), eq(context)))
                .thenReturn(new MatchResult(MatchType.NONE, Set.of()));

        List<Association> results = scorer.scoreAndSortResults(
                List.of(candidate),
                context
        );

        assertEquals(List.of(), results);
    }

    @Test
    void scoreAndSortResults_ShouldReturnCandidate_WhenScoreIsPositive() {
        FieldMatcher fieldMatcher = mock(FieldMatcher.class);
        SearchResultScorer scorer = new SearchResultScorer(fieldMatcher);

        SearchContext context = mock(SearchContext.class);

        NormalizedAssociation candidate = new NormalizedAssociation(
                new Association(),
                "name",
                "description"
        );

        when(fieldMatcher.match(any(), eq(context)))
                .thenReturn(new MatchResult(MatchType.CONTAINS, Set.of("irrelevant")));

        List<Association> results = scorer.scoreAndSortResults(
                List.of(candidate),
                context
        );

        assertEquals(List.of(candidate.association()), results);
    }

    @Test
    void scoreAndSortResults_ShouldSortCandidatesByScoreDescending() {
        FieldMatcher fieldMatcher = mock(FieldMatcher.class);
        SearchResultScorer scorer = new SearchResultScorer(fieldMatcher);

        SearchContext context = mock(SearchContext.class);

        NormalizedAssociation candidate1 = new NormalizedAssociation(
                new Association(),
                "name1",
                "description1"
        );

        NormalizedAssociation candidate2 = new NormalizedAssociation(
                new Association(),
                "name2",
                "description2"
        );

        when(fieldMatcher.match(eq("name1"), eq(context)))
                .thenReturn(new MatchResult(MatchType.PREFIX, Set.of("irrelevant")));

        when(fieldMatcher.match(eq("description1"), eq(context)))
                .thenReturn(new MatchResult(MatchType.PREFIX, Set.of("irrelevant")));

        when(fieldMatcher.match(eq("name2"), eq(context)))
                .thenReturn(new MatchResult(MatchType.STRICT_EXACT, Set.of("irrelevant")));

        when(fieldMatcher.match(eq("description2"), eq(context)))
                .thenReturn(new MatchResult(MatchType.STRICT_EXACT, Set.of("irrelevant")));


        List<Association> results = scorer.scoreAndSortResults(
                List.of(candidate1, candidate2),
                context
        );

        assertEquals(List.of(candidate2.association(), candidate1.association()), results);
    }
}