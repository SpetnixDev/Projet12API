package com.pgbdev.projet12.mapper;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.dto.response.AssociationResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {
        TagMapper.class, DepartmentMapper.class
})
public interface AssociationMapper {
    AssociationResponse toResponse(Association association);

    List<AssociationResponse> toResponseList(List<Association> associations);
}
