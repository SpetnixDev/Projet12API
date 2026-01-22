package com.pgbdev.projet12.service.association.search.query;

import com.pgbdev.projet12.domain.Association;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;

public class AssociationSpecification {
    public static Specification<Association> build(AssociationSearchCriteria criteria) {
        return Specification.where(textSearch(criteria.query()));
    }

    private static Specification<Association> textSearch(String text) {
        return (root, query, criteriaBuilder) -> {
            if (text == null || text.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String[] splitText = text.toLowerCase().split(" ");

            Expression<String> nameExpression = criteriaBuilder.lower(root.get("name"));
            Expression<String> descriptionExpression = criteriaBuilder.lower(root.get("description"));

            Predicate[] predicates = Arrays.stream(splitText)
                    .map(word -> {
                        String pattern = "%" + word + "%";
                        Predicate namePredicate = criteriaBuilder.like(nameExpression, pattern);
                        Predicate descriptionPredicate = criteriaBuilder.like(descriptionExpression, pattern);

                        return criteriaBuilder.or(namePredicate, descriptionPredicate);
                    })
                    .toArray(Predicate[]::new);

            return criteriaBuilder.or(predicates);
        };
    }
}
