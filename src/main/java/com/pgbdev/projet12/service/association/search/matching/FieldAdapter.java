package com.pgbdev.projet12.service.association.search.matching;

import com.pgbdev.projet12.service.association.search.query.SearchField;

public interface FieldAdapter<T> {
    String getFieldValue(T entity, SearchField field);
}
