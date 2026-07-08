package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    @Override
    @EntityGraph(attributePaths = {"subscriptions"})
    Optional<User> findById(UUID id);

    @Query("""
            select count(u)
            from User u
            join u.supportedAssociations association
            where association.id = :associationId
            """)
    long countSupportsByAssociationId(@Param("associationId") UUID associationId);

    @Query("""
            select association.id as associationId, count(u) as supportCount
            from User u
            join u.supportedAssociations association
            where association.id in :associationIds
            group by association.id
            """)
    List<AssociationSupportCount> countSupportsByAssociationIds(@Param("associationIds") Collection<UUID> associationIds);

    interface AssociationSupportCount {
        UUID getAssociationId();

        long getSupportCount();
    }
}
