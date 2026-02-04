package com.pgbdev.projet12.technical.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    DUPLICATE_RESOURCE(11, HttpStatus.CONFLICT, "Resource already exists"),
    RESOURCE_NOT_FOUND(12, HttpStatus.NOT_FOUND, "Resource not found"),

    AUTHENTICATION_FAILED(21, HttpStatus.UNAUTHORIZED, "Authentication failed"),
    ACCESS_DENIED(22, HttpStatus.NOT_FOUND, "Resource not found"),

    INVALID_REQUEST(31, HttpStatus.BAD_REQUEST, "Invalid request"),

    INTERNAL_SERVER_ERROR(41, HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");

    private final int code;
    private final HttpStatus httpStatus;
    private final String defaultMessage;
}
