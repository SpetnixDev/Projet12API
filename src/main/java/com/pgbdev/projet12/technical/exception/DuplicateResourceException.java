package com.pgbdev.projet12.technical.exception;

import com.pgbdev.projet12.technical.config.ErrorCode;

public class DuplicateResourceException extends APIException {
    public DuplicateResourceException(Class<?> resource, String field, Object value, String customMessage) {
        super(String.format("Duplicate resource %s found with %s='%s'", resource, field, value),
                resource,
                customMessage);
    }

    @Override
    public ErrorCode getErrorCode() {
        return ErrorCode.DUPLICATE_RESOURCE;
    }
}
