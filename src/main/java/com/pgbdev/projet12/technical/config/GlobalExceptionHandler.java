package com.pgbdev.projet12.technical.config;

import com.pgbdev.projet12.technical.ErrorResponse;
import com.pgbdev.projet12.technical.exception.APIException;
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
        ErrorCode errorCode = ex.getErrorCode();
        String path = request.getRequestURI() + (request.getQueryString() != null ? "?" + request.getQueryString() : "");

        log(errorCode, ex, ex.getCustomMessage(), ex.getEntity(), request, path);
        return respond(errorCode, ex.getCustomMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        ErrorCode errorCode = ErrorCode.INVALID_REQUEST;
        String path = request.getRequestURI() + (request.getQueryString() != null ? "?" + request.getQueryString() : "");
        String message = Objects.requireNonNullElse(ex.getBindingResult().getFieldError(), ex.getBindingResult().getGlobalError()).getDefaultMessage();
        String customMessage = "Request validation failed: " + message;
        String entity = ex.getBindingResult().getTarget() != null ? ex.getBindingResult().getTarget().getClass().getSimpleName() : "Unknown";

        log(errorCode, ex, customMessage, entity, request, path);
        return respond(errorCode, customMessage);
    }

    private void log(
            ErrorCode errorCode,
            Exception ex,
            String customMessage,
            String entity,
            HttpServletRequest request,
            String path) {
        logger.error("""
                        Exception occurred:\s
                        -- Status: {}
                        -- Code: {}
                        -- Error: {}
                        -- Exception: {}
                        -- Message: {}
                        -- CustomMessage: {}
                        -- Entity: {}
                        -- Method: {}
                        -- Path: {}
                        -- Timestamp: {}""",
                errorCode.getHttpStatus().value(),
                errorCode.getCode(),
                errorCode,
                ex.getClass().getSimpleName(),
                ex.getMessage(),
                customMessage,
                entity,
                request.getMethod(),
                path,
                Instant.now()
        );
    }

    private ResponseEntity<ErrorResponse> respond(ErrorCode errorCode, String customMessage) {
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(new ErrorResponse(
                        errorCode.getHttpStatus().value(),
                        customMessage));
    }
}
