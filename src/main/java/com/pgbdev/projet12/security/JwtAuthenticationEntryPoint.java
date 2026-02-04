package com.pgbdev.projet12.security;

import com.pgbdev.projet12.technical.ErrorResponse;
import com.pgbdev.projet12.technical.config.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        ErrorCode errorCode = ErrorCode.AUTHENTICATION_FAILED;
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
