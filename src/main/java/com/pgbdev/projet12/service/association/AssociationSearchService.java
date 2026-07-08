package com.pgbdev.projet12.service.association;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.dto.request.AssociationSearchRequest;
import com.pgbdev.projet12.dto.response.AssociationResponse;
import com.pgbdev.projet12.dto.response.PageResponse;
import com.pgbdev.projet12.mapper.AssociationMapper;
import com.pgbdev.projet12.repository.AssociationRepository;
import com.pgbdev.projet12.repository.UserRepository;
import com.pgbdev.projet12.service.TagResolver;
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
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssociationSearchService {
    private final AssociationRepository associationRepository;
    private final AssociationMapper associationMapper;
    private final SearchResultScorer searchResultScorer;
    private final TagResolver tagResolver;
    private final TextNormalizer normalizer;
    private final Tokenizer tokenizer;
    private final UserRepository userRepository;

    public PageResponse<AssociationResponse> searchAssociations(AssociationSearchRequest request, Pageable pageable) {
        List<Long> tagIds = tagResolver.resolveIds(request.tags());

        AssociationSearchCriteria criteria = new AssociationSearchCriteria(
                null,
                tagIds,
                request.departments()
        );

        Specification<Association> specification = AssociationSpecification.build(criteria);
        List<NormalizedAssociation> normalizedResults = associationRepository.findAll(specification)
                .stream()
                .map(association -> new NormalizedAssociation(
                        association,
                        normalizer.normalize(association.getName()),
                        normalizer.normalize(association.getDescription())
                )).toList();
        SearchContext context = SearchContext.from(request.query(), normalizer, tokenizer);

        List<Association> results = searchResultScorer.scoreAndSortResults(normalizedResults, context);
        Map<UUID, Long> supportCounts = getSupportCounts(results);
        List<AssociationResponse> response = associationMapper.toResponseList(results, supportCounts);

        Page<AssociationResponse> page = getPageFromList(response, pageable);

        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    private Page<AssociationResponse> getPageFromList(List<AssociationResponse> associations, Pageable pageable) {
        int total = associations.size();
        int fromIndex = Math.toIntExact(pageable.getOffset());
        if (fromIndex >= total) {
            return PageableExecutionUtils.getPage(List.of(), pageable, () -> total);
        }

        int toIndex = Math.min(fromIndex + pageable.getPageSize(), total);
        List<AssociationResponse> pageContent = associations.subList(fromIndex, toIndex);

        return PageableExecutionUtils.getPage(pageContent, pageable, () -> total);
    }

    private Map<UUID, Long> getSupportCounts(List<Association> associations) {
        List<UUID> associationIds = associations.stream()
                .map(Association::getId)
                .toList();

        if (associationIds.isEmpty()) {
            return Map.of();
        }

        return userRepository.countSupportsByAssociationIds(associationIds).stream()
                .collect(Collectors.toMap(
                        UserRepository.AssociationSupportCount::getAssociationId,
                        UserRepository.AssociationSupportCount::getSupportCount
                ));
    }
}
