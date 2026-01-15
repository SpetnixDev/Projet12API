package com.pgbdev.projet12.service.association;

import com.pgbdev.projet12.domain.Association;
import jakarta.persistence.criteria.Expression;
import org.springframework.data.jpa.domain.Specification;

public class AssociationSpecifications {
    public static Specification<Association> build(AssociationSearchCriteria criteria) {
        return Specification.where(textSearch(criteria.text()));
    }

    private static Specification<Association> textSearch(String text) {
        return (root, query, criteriaBuilder) -> {
            if (text == null || text.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            String pattern = "%" + text.toLowerCase() + "%";

            Expression<Integer> nameScore = criteriaBuilder.<Integer>selectCase()
                    .when(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern), 3)
                    .otherwise(0);

            Expression<Integer> descriptionScore = criteriaBuilder.<Integer>selectCase()
                    .when(criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern), 1)
                    .otherwise(0);

            query.orderBy(criteriaBuilder.desc(criteriaBuilder.sum(nameScore, descriptionScore)));

            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern)
            );
        };
    }
}
