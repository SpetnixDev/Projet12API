package com.pgbdev.projet12.technical.exception;

import com.pgbdev.projet12.technical.config.ErrorCode;

public class InvalidDataException extends APIException {
    public InvalidDataException(String message) {
        super(message, Object.class, message);
    }

    @Override
    public ErrorCode getErrorCode() {
        return null;
    }
}
