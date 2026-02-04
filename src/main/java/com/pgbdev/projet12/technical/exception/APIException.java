package com.pgbdev.projet12.technical.exception;

import com.pgbdev.projet12.technical.config.ErrorCode;
import lombok.Getter;

@Getter
public abstract class APIException extends RuntimeException {
    private final ErrorCode code;

    public APIException(ErrorCode code, String internalMessage, Throwable cause) {
        super(internalMessage != null ? internalMessage : code.getDefaultMessage(), cause);

        this.code = code;
    }

    public APIException(ErrorCode code, String internalMessage) {
        this(code, internalMessage, null);
    }
}
