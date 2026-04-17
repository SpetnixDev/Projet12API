package com.pgbdev.projet12.controller;

import com.pgbdev.projet12.dto.request.post.CreatePostRequest;
import com.pgbdev.projet12.dto.request.post.UpdatePostRequest;
import com.pgbdev.projet12.dto.response.PageResponse;
import com.pgbdev.projet12.dto.response.PostResponse;
import com.pgbdev.projet12.security.AuthPrincipal;
import com.pgbdev.projet12.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping("/association/{associationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSOCIATION')")
    public ResponseEntity<PostResponse> create(@PathVariable UUID associationId, @RequestBody CreatePostRequest request) {
        PostResponse response = postService.create(associationId, request);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getById(id));
    }

    @GetMapping("/association/{associationId}")
    public ResponseEntity<PageResponse<PostResponse>> getAllByAssociation(
            @PathVariable UUID associationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.getAllByAssociation(associationId, PageRequest.of(page, size)));
    }

    @GetMapping("/feed")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PageResponse<PostResponse>> getFeed(
            @AuthenticationPrincipal AuthPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(postService.getFeedForUser(principal.ownerId(), PageRequest.of(page, size)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSOCIATION')")
    public ResponseEntity<PostResponse> update(@PathVariable Long id, @RequestBody UpdatePostRequest request) {
        PostResponse response = postService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSOCIATION')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
