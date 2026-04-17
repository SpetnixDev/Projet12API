package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.domain.Post;
import com.pgbdev.projet12.dto.request.post.CreatePostRequest;
import com.pgbdev.projet12.dto.request.post.UpdatePostRequest;
import com.pgbdev.projet12.dto.response.PageResponse;
import com.pgbdev.projet12.dto.response.PostResponse;
import com.pgbdev.projet12.mapper.PostMapper;
import com.pgbdev.projet12.repository.AssociationRepository;
import com.pgbdev.projet12.repository.PostRepository;
import com.pgbdev.projet12.technical.exception.resource.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final AssociationRepository associationRepository;
    private final PostMapper postMapper;

    private final Parser markdownParser = Parser.builder().build();
    private final HtmlRenderer htmlRenderer = HtmlRenderer.builder().build();

    @Transactional
    public PostResponse create(
            UUID associationId,
            CreatePostRequest request) {
        Association owner = associationRepository.findById(associationId)
                .orElseThrow(() -> new ResourceNotFoundException(Association.class, "id", associationId.toString()));

        Post post = new Post();
        post.setTitle(request.title());
        post.setContentSource(request.contentSource());
        post.setContentRenderedHtml(renderMarkdownToSafeHtml(request.contentSource()));
        post.setOwner(owner);

        return postMapper.toResponse(postRepository.save(post));
    }

    public PostResponse getById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Post.class, "id", id));

        return postMapper.toResponse(post);
    }

    public PageResponse<PostResponse> getAllByAssociation(UUID associationId, Pageable pageable) {
        Page<Post> page = postRepository.findAllByOwner_IdOrderByPostedAtDesc(associationId, pageable);

        return new PageResponse<>(
                page.getContent().stream().map(postMapper::toResponse).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    public PageResponse<PostResponse> getFeedForUser(UUID userId, Pageable pageable) {
        Page<Post> page = postRepository.findFeedForUser(userId, pageable);

        return new PageResponse<>(
                page.getContent().stream().map(postMapper::toResponse).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    @Transactional
    public PostResponse update(Long id, UpdatePostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Post.class, "id", id));

        post.setTitle(request.title());
        post.setContentSource(request.contentSource());
        post.setContentRenderedHtml(renderMarkdownToSafeHtml(request.contentSource()));
        post.setModifiedAt(Instant.now());

        return postMapper.toResponse(post);
    }

    @Transactional
    public void delete(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(Post.class, "id", id));

        postRepository.delete(post);
    }

    private String renderMarkdownToSafeHtml(String markdown) {
        String rawHtml = htmlRenderer.render(markdownParser.parse(markdown));
        return Jsoup.clean(rawHtml, Safelist.relaxed());
    }
}
