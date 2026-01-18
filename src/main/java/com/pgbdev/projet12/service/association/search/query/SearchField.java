package com.pgbdev.projet12.service.association.search.query;

import lombok.Getter;

@Getter
public enum SearchField {
    NAME (1.0),
    DESCRIPTION (0.4);

    private final double weight;

    SearchField(double weight) {
        this.weight = weight;
    }
}
