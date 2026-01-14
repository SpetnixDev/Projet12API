package com.pgbdev.projet12.security;

import com.pgbdev.projet12.domain.auth.AccountType;

import java.util.UUID;

public record AuthPrincipal(
        UUID authAccountId,
        UUID ownerId,
        AccountType type
) {}
