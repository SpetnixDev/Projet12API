package com.pgbdev.projet12.technical.exception;

import com.pgbdev.projet12.technical.config.ErrorCode;
import lombok.Getter;

@Getter
public abstract class APIException extends RuntimeException {
    private final String entity;
    private final String customMessage;

    public APIException(String message, Class<?> clazz, String customMessage) {
        super(message);

        this.entity = clazz.getSimpleName();
        this.customMessage = customMessage;
    }

    public abstract ErrorCode getErrorCode();
}
