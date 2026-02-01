package com.pgbdev.projet12.repository;

import com.pgbdev.projet12.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByCodeIn(List<String> codes);
}