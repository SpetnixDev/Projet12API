package com.pgbdev.projet12.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateAssociationProfileRequest(
        @Size(max = 20)
        String phoneNumber,

        @Email
        @Size(max = 255)
        String contactEmail,

        @Size(max = 500)
        String address,

        @Size(max = 255)
        String websiteUrl,

        @Size(max = 50)
        String rnaNumber,

        @Size(max = 2000)
        String donationUseDescription
) {}
