package com.pgbdev.projet12.service.auth;

import com.pgbdev.projet12.domain.auth.AccountType;
import com.pgbdev.projet12.domain.auth.AuthAccount;
import com.pgbdev.projet12.domain.auth.Role;
import com.pgbdev.projet12.repository.AuthAccountRepository;
import com.pgbdev.projet12.service.AssociationService;
import com.pgbdev.projet12.service.UserService;
import com.pgbdev.projet12.technical.exception.AuthenticationException;
import com.pgbdev.projet12.technical.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthAccountService {
    private final AuthAccountRepository authAccountRepository;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;
    private final AssociationService associationService;

    public AuthAccount create(
            String email,
            String passwordHash,
            AccountType type,
            UUID ownerId,
            Set<Role> roles
    ) {
        AuthAccount authAccount = new AuthAccount();
        authAccount.setEmail(email);
        authAccount.setPasswordHash(passwordHash);
        authAccount.setType(type);
        authAccount.setOwnerId(ownerId);
        authAccount.setRoles(roles);

        return authAccountRepository.save(authAccount);
    }

    public AuthAccount authenticate(String email, String password) {
        AuthAccount account = authAccountRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("Invalid credentials"));

        if (!BCrypt.checkpw(password, account.getPasswordHash())) {
            throw new AuthenticationException("Invalid credentials");
        }

        if (!account.isEnabled()) {
            throw new AuthenticationException("Account disabled");
        }

        return account;
    }

    @Transactional
    public void deleteAccount(UUID authAccountId) {
        AuthAccount account = authAccountRepository.findById(authAccountId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        AuthAccount.class,
                        "id",
                        authAccountId.toString(),
                        "Account not found"
                ));

        refreshTokenService.deleteAllForAuthAccount(authAccountId);

        switch (account.getType()) {
            case USER -> userService.delete(account.getOwnerId());
            case ASSOCIATION -> associationService.delete(account.getOwnerId());
            default -> throw new IllegalStateException("Unsupported account type");
        }

        authAccountRepository.delete(account);
    }
}
