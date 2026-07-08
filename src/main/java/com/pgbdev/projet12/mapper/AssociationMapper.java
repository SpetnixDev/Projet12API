package com.pgbdev.projet12.mapper;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.dto.response.AssociationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Mapper(componentModel = "spring", uses = {
        TagMapper.class, DepartmentMapper.class
})
public interface AssociationMapper {
    @Mapping(target = "supportCount", constant = "0L")
    AssociationResponse toResponse(Association association);

    List<AssociationResponse> toResponseList(List<Association> associations);

    default AssociationResponse toResponse(Association association, long supportCount) {
        AssociationResponse response = toResponse(association);

        return new AssociationResponse(
                response.id(),
                response.name(),
                response.description(),
                response.createdAt(),
                response.tags(),
                response.departments(),
                supportCount
        );
    }

    default List<AssociationResponse> toResponseList(List<Association> associations, Map<UUID, Long> supportCounts) {
        return associations.stream()
                .map(association -> toResponse(
                        association,
                        supportCounts.getOrDefault(association.getId(), 0L)
                ))
                .toList();
    }
}
