package com.pgbdev.projet12.security;

import com.pgbdev.projet12.technical.ErrorResponse;
import com.pgbdev.projet12.technical.config.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomDeniedAccessHandler implements AccessDeniedHandler {
    private final ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        ErrorCode errorCode = ErrorCode.ACCESS_DENIED;
        int httpStatus = errorCode.getHttpStatus().value();

        ErrorResponse errorResponse = new ErrorResponse(
                httpStatus,
                errorCode.getDefaultMessage()
        );

        response.setStatus(httpStatus);
        response.setContentType("application/json");

        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
