package com.pgbdev.projet12.infra.client;

import com.pgbdev.projet12.config.properties.GeoApiProperties;
import com.pgbdev.projet12.dto.response.external.DepartmentExternalResponse;
import com.pgbdev.projet12.dto.response.external.RegionExternalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GeoApiGouvClient {
    private final GeoApiProperties properties;
    private final RestClient restClient = RestClient.create();

    public List<DepartmentExternalResponse> fetchDepartments() {
        return restClient.get()
                .uri(properties.baseUrl() + "/departements")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public List<RegionExternalResponse> fetchRegions() {
        return restClient.get()
                .uri(properties.baseUrl() + "/regions")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}
