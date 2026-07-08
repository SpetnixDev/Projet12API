package com.pgbdev.projet12.dto.request.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(
        @NotBlank
        @Size(max = 255)
        String title,

        @NotBlank String contentSource
) {}
