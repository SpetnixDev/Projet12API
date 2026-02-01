package com.pgbdev.projet12.service.association.search.query;

import com.pgbdev.projet12.domain.Association;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AssociationSpecificationTest {
    @Test
    void build_shouldReturnNonNullSpecification() {
        AssociationSearchCriteria criteria = new AssociationSearchCriteria("query", List.of());
        Specification<Association> specification = AssociationSpecification.build(criteria);

        assertNotNull(specification);
    }
}
