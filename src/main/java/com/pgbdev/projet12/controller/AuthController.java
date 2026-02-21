package com.pgbdev.projet12.controller;

import com.pgbdev.projet12.domain.auth.AccountType;
import com.pgbdev.projet12.dto.request.LoginRequest;
import com.pgbdev.projet12.dto.request.RegisterRequest;
import com.pgbdev.projet12.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @RequestParam AccountType type,
            @RequestBody @Valid RegisterRequest registerRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        authService.register(type, registerRequest, request, response);

        return ResponseEntity.status(201).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(
            @RequestBody @Valid LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        authService.login(loginRequest, request, response);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(HttpServletRequest request, HttpServletResponse response) {
        authService.refresh(request, response);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);

        return ResponseEntity.noContent().build();
    }
}

