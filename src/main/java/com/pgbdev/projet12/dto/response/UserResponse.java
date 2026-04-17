package com.pgbdev.projet12.dto.response;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String username
) {}
