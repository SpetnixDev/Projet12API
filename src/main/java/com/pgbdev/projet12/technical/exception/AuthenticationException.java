package com.pgbdev.projet12.technical.exception;

import com.pgbdev.projet12.domain.User;
import com.pgbdev.projet12.technical.config.ErrorCode;

public class AuthenticationException extends APIException {
    public AuthenticationException(String message) {
        super(message, User.class, message);
    }

    @Override
    public ErrorCode getErrorCode() {
        return ErrorCode.AUTHENTICATION_FAILED;
    }
}
