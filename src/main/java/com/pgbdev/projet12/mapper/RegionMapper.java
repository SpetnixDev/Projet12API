package com.pgbdev.projet12.mapper;

import com.pgbdev.projet12.domain.Region;
import com.pgbdev.projet12.dto.response.RegionResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RegionMapper {
    RegionResponse toResponse(Region region);

    List<RegionResponse> toResponseList(List<Region> regions);
}
