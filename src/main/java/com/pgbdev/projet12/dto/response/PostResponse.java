package com.pgbdev.projet12.dto.response;

import java.time.Instant;

public record PostResponse(
        Long id,
        String title,
        String contentSource,
        String contentRenderedHtml,
        Instant postedAt,
        Instant modifiedAt
) {}
