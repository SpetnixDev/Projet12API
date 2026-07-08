package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @EntityGraph(attributePaths = {"owner"})
    Optional<Post> findById(Long id);

    @EntityGraph(attributePaths = {"owner"})
    Page<Post> findAllByOwner_IdOrderByPostedAtDesc(UUID ownerId, Pageable pageable);

    @EntityGraph(attributePaths = {"owner"})
    @Query("""
            select p
            from Post p
            where p.owner.id in (
                select a.id
                from User u
                join u.subscriptions a
                where u.id = :userId
            )
            order by p.postedAt desc
            """)
    Page<Post> findFeedForUser(@Param("userId") UUID userId, Pageable pageable);
}
