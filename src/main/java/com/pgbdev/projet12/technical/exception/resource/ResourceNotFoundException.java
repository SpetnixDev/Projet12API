package com.pgbdev.projet12.technical.exception.resource;

import com.pgbdev.projet12.technical.config.ErrorCode;
import com.pgbdev.projet12.technical.exception.APIException;

public class ResourceNotFoundException extends APIException {
    public ResourceNotFoundException(Class<?> resource, String field, Object value) {
        super(ErrorCode.RESOURCE_NOT_FOUND, String.format("Resource %s not found with %s='%s'", resource.getSimpleName(), field, value));
    }
}
