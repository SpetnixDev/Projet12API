package com.pgbdev.projet12.technical.exception.resource;

import com.pgbdev.projet12.technical.config.ErrorCode;
import com.pgbdev.projet12.technical.exception.APIException;
import com.pgbdev.projet12.technical.exception.ClientMessageProvider;

public class DuplicateResourceException extends APIException implements ClientMessageProvider {
    private final String clientMessage;

    public DuplicateResourceException(Class<?> resource, String field, Object value, String clientMessage) {
        super(ErrorCode.DUPLICATE_RESOURCE, String.format("Resource %s already exists with %s='%s'", resource.getSimpleName(), field, value));

        this.clientMessage = clientMessage;
    }

    @Override
    public String getClientMessage() {
        return clientMessage;
    }
}
