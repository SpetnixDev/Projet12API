package com.pgbdev.projet12.technical.config;

import com.pgbdev.projet12.technical.ErrorResponse;
import com.pgbdev.projet12.technical.exception.APIException;
import com.pgbdev.projet12.technical.exception.ClientMessageProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(APIException.class)
    public ResponseEntity<ErrorResponse> handleAPIException(APIException ex, HttpServletRequest request) {
        ErrorCode errorCode = ex.getCode();
        String path = request.getRequestURI() + (request.getQueryString() != null ? "?" + request.getQueryString() : "");

        log(errorCode, ex, request, path);

        String message = (ex instanceof ClientMessageProvider provider) ?
                provider.getClientMessage() :
                errorCode.getDefaultMessage();

        return respond(errorCode, message);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        ErrorCode errorCode = ErrorCode.INVALID_REQUEST;
        String path = request.getRequestURI() + (request.getQueryString() != null ? "?" + request.getQueryString() : "");
        String message = Objects.requireNonNullElse(ex.getBindingResult().getFieldError(), ex.getBindingResult().getGlobalError()).getDefaultMessage();
        String customMessage = "Request validation failed: " + message;

        log(errorCode, ex, request, path);
        return respond(errorCode, customMessage);
    }

    private void log(
            ErrorCode errorCode,
            Exception ex,
            HttpServletRequest request,
            String path) {
        logger.error("""
                        Exception occurred:\s
                        -- Status: {}
                        -- Code: {}
                        -- Error: {}
                        -- Exception: {}
                        -- Message: {}
                        -- Method: {}
                        -- Path: {}
                        -- Timestamp: {}""",
                errorCode.getHttpStatus().value(),
                errorCode.getCode(),
                errorCode,
                ex.getClass().getSimpleName(),
                ex.getMessage(),
                request.getMethod(),
                path,
                Instant.now(),
                ex
        );
    }

    private ResponseEntity<ErrorResponse> respond(ErrorCode errorCode, String message) {
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(new ErrorResponse(
                        errorCode.getHttpStatus().value(),
                        message));
    }
}
