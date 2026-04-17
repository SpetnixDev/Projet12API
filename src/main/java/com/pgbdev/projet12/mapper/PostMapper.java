package com.pgbdev.projet12.mapper;

import com.pgbdev.projet12.domain.Post;
import com.pgbdev.projet12.dto.response.PostResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostResponse toResponse(Post post);
}
