package com.pgbdev.projet12.mapper;

import com.pgbdev.projet12.domain.Post;
import com.pgbdev.projet12.dto.response.PostResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "ownerName", source = "owner.name")
    PostResponse toResponse(Post post);
}
