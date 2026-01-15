package com.pgbdev.projet12.service.association;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.repository.AssociationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssociationSearchService {
    private final AssociationRepository associationRepository;

    public Page<Association> searchAssociations(AssociationSearchCriteria criteria, Pageable pageable) {
        Specification<Association> specifications = AssociationSpecifications.build(criteria);

        return associationRepository.findAll(specifications, pageable);
    }
}
