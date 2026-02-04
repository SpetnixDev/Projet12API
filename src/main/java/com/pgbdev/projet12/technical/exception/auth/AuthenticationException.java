package com.pgbdev.projet12.technical.exception.auth;

import com.pgbdev.projet12.technical.config.ErrorCode;
import com.pgbdev.projet12.technical.exception.APIException;
import com.pgbdev.projet12.technical.exception.ClientMessageProvider;

public class AuthenticationException extends APIException implements ClientMessageProvider {
    private final String clientMessage;

    public AuthenticationException(String internalMessage, String clientMessage) {
        super(ErrorCode.AUTHENTICATION_FAILED, internalMessage);

        this.clientMessage = clientMessage;
    }

    public AuthenticationException(String clientMessage) {
        this(null, clientMessage);
    }

    @Override
    public String getClientMessage() {
        return clientMessage;
    }
}
