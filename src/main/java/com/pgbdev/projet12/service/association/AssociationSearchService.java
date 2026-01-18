package com.pgbdev.projet12.service.association;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.repository.AssociationRepository;
import com.pgbdev.projet12.service.association.search.context.NormalizedAssociation;
import com.pgbdev.projet12.service.association.search.context.SearchContext;
import com.pgbdev.projet12.service.association.search.matching.SearchResultScorer;
import com.pgbdev.projet12.service.association.search.preprocessing.TextNormalizer;
import com.pgbdev.projet12.service.association.search.preprocessing.Tokenizer;
import com.pgbdev.projet12.service.association.search.query.AssociationSearchCriteria;
import com.pgbdev.projet12.service.association.search.query.AssociationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssociationSearchService {
    private final AssociationRepository associationRepository;
    private final SearchResultScorer searchResultScorer;
    private final TextNormalizer normalizer;
    private final Tokenizer tokenizer;

    public Page<Association> searchAssociations(AssociationSearchCriteria criteria, Pageable pageable) {
        Specification<Association> specification = AssociationSpecification.build(criteria);
        List<NormalizedAssociation> normalizedResults = associationRepository.findAll(specification)
                .stream()
                .map(association -> new NormalizedAssociation(
                        association,
                        normalizer.normalize(association.getName()),
                        normalizer.normalize(association.getDescription())
                )).toList();
        SearchContext context = SearchContext.from(criteria.query(), normalizer, tokenizer);

        List<Association> results = searchResultScorer.scoreAndSortResults(normalizedResults, context);

        return getPageFromList(results, pageable);
    }

    private Page<Association> getPageFromList(List<Association> associations, Pageable pageable) {
        int total = associations.size();
        int fromIndex = Math.toIntExact(pageable.getOffset());
        if (fromIndex >= total) {
            return PageableExecutionUtils.getPage(List.of(), pageable, () -> total);
        }

        int toIndex = Math.min(fromIndex + pageable.getPageSize(), total);
        List<Association> pageContent = associations.subList(fromIndex, toIndex);

        return PageableExecutionUtils.getPage(pageContent, pageable, () -> total);
    }
}
