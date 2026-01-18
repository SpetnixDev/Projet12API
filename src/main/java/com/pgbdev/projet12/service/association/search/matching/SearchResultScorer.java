package com.pgbdev.projet12.service.association.search.matching;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.service.association.search.context.NormalizedAssociation;
import com.pgbdev.projet12.service.association.search.context.SearchContext;
import com.pgbdev.projet12.service.association.search.query.SearchField;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchResultScorer {
    private final FieldMatcher fieldMatcher;
    private final FieldAdapter<NormalizedAssociation> fieldAdapter = (entity, field) -> switch (field) {
        case NAME -> entity.normalizedName();
        case DESCRIPTION -> entity.normalizedDescription();
    };

    public List<Association> scoreAndSortResults(List<NormalizedAssociation> candidates, SearchContext context) {
        return candidates.stream()
                .map(candidate -> {
                    double totalScore = Arrays.stream(SearchField.values())
                            .mapToDouble(field -> {
                                String fieldValue = fieldAdapter.getFieldValue(candidate, field);
                                double fieldWeight = field.getWeight();

                                MatchResult matchResult = fieldMatcher.match(fieldValue, context);
                                return matchResult.matchType().getScore() * fieldWeight;
                            })
                            .sum();

                    return Pair.of(candidate.association(), totalScore);
                })
                .filter(p -> p.getSecond() > 0d)
                .sorted(Comparator.comparingDouble((Pair<Association, Double> p) -> p.getSecond()).reversed())
                .map(Pair::getFirst)
                .toList();
    }
}
