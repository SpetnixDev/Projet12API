package com.pgbdev.projet12.technical.exception;

import com.pgbdev.projet12.technical.config.ErrorCode;

public class ResourceNotFoundException extends APIException {
    public ResourceNotFoundException(Class<?> resource, String field, Object value, String customMessage) {
        super(String.format("No resource '%s' found with %s='%s'", resource, field, value),
                resource,
                customMessage);
    }

    @Override
    public ErrorCode getErrorCode() {
        return ErrorCode.RESOURCE_NOT_FOUND;
    }
}
