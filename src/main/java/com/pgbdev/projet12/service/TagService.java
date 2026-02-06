package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.Tag;
import com.pgbdev.projet12.dto.response.TagResponse;
import com.pgbdev.projet12.mapper.TagMapper;
import com.pgbdev.projet12.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    public Set<Tag> getTags(List<Long> tagIds) {
        return Set.copyOf(tagRepository.findAllById(tagIds));
    }

    public List<TagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(tagMapper::toResponse)
                .toList();
    }
}
