package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.Tag;
import com.pgbdev.projet12.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagResolver {
    private final TagRepository tagRepository;

    public List<Long> resolveIds(List<String> codes) {
        if (codes == null || codes.isEmpty()) {
            return List.of();
        }

        List<Tag> tags = tagRepository.findByCodeIn(codes);

        if (tags.size() != codes.size()) {
            throw new IllegalArgumentException("Tag inconnu");
        }

        return tags.stream()
                .map(Tag::getId)
                .toList();
    }
}
