package com.pgbdev.projet12.domain.auth;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.proxy.HibernateProxy;
import org.hibernate.type.SqlTypes;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "auth_accounts")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class AuthAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "auth_account_roles",
            joinColumns = @JoinColumn(name = "auth_account_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @ToString.Exclude
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean verified;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean enabled = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;

    @Column(nullable = false)
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID ownerId;

    public AuthAccount(String email, String passwordHash, AccountType type, UUID ownerId) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.type = type;
        this.ownerId = ownerId;
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        AuthAccount that = (AuthAccount) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
