package com.pgbdev.projet12.technical.exception.request;

import com.pgbdev.projet12.technical.config.ErrorCode;
import com.pgbdev.projet12.technical.exception.APIException;
import com.pgbdev.projet12.technical.exception.ClientMessageProvider;

public class InvalidTerritorySelectionException extends APIException implements ClientMessageProvider {
    private final String clientMessage;

    public InvalidTerritorySelectionException(Class<?> resource, String clientMessage) {
        super(ErrorCode.INVALID_REQUEST, String.format("Invalid selection for %s.", resource.getSimpleName()));

        this.clientMessage = clientMessage;
    }

    @Override
    public String getClientMessage() {
        return clientMessage;
    }
}
