package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @EntityGraph(attributePaths = {"owner"})
    Optional<Post> findById(Long id);

    @EntityGraph(attributePaths = {"owner"})
    Page<Post> findAllByOwner_IdOrderByPostedAtDesc(UUID ownerId, Pageable pageable);
}