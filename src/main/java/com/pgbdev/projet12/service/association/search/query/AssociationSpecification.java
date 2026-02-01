package com.pgbdev.projet12.service.association.search.query;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.domain.Tag;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.List;

public class AssociationSpecification {
    public static Specification<Association> build(AssociationSearchCriteria criteria) {
        return Specification
                .where(textSearch(criteria.query()))
                .and(tagSearch(criteria.tags()));
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

    private static Specification<Association> tagSearch(List<Long> tags) {
        return (root, query, criteriaBuilder) -> {
            if (tags == null || tags.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            query.distinct(true);

            Join<Association, Tag> tagJoin = root.join("tags");

            return tagJoin.get("id").in(tags);
        };
    }
}
