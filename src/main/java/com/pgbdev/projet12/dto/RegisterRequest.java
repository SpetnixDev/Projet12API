package com.pgbdev.projet12.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @Email(message = "The email format is invalid")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Username is mandatory")
    @Size(min = 3, max = 16, message = "Username must be between 3 and 16 characters long")
    @Pattern(
            regexp = "^[a-zA-Z0-9_]{3,16}$",
            message = "Username must be alphanumeric and can include underscores, between 3 and 16 characters long"
    )
    private String name;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    private String password;
}
