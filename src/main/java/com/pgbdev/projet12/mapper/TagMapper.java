package com.pgbdev.projet12.mapper;

import com.pgbdev.projet12.domain.Tag;
import com.pgbdev.projet12.dto.response.TagResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagResponse toResponse(Tag tag);
}
