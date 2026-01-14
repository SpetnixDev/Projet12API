package com.pgbdev.projet12.technical.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    DUPLICATE_RESOURCE(11, HttpStatus.CONFLICT),
    RESOURCE_NOT_FOUND(12, HttpStatus.NOT_FOUND),
    INSUFFICIENT_RESOURCES(13, HttpStatus.CONFLICT),

    AUTHENTICATION_FAILED(21, HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(22, HttpStatus.NOT_FOUND),

    INVALID_REQUEST(31, HttpStatus.BAD_REQUEST),
    INVALID_DATA(32, HttpStatus.BAD_REQUEST),

    INTERNAL_SERVER_ERROR(41, HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final HttpStatus httpStatus;
}
