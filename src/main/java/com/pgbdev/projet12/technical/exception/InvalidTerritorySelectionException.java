package com.pgbdev.projet12.technical.exception;

import com.pgbdev.projet12.technical.config.ErrorCode;

public class InvalidTerritorySelectionException extends APIException {
    public InvalidTerritorySelectionException(Class<?> resource, String customMessage) {
        super(String.format("Invalid territory selection for %s", resource.getSimpleName()),
                resource,
                customMessage);
    }

    @Override
    public ErrorCode getErrorCode() {
        return ErrorCode.INVALID_REQUEST;
    }
}
