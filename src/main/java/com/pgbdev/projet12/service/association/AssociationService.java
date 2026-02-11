package com.pgbdev.projet12.service.association;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.domain.Department;
import com.pgbdev.projet12.domain.Region;
import com.pgbdev.projet12.domain.Tag;
import com.pgbdev.projet12.dto.response.AssociationResponse;
import com.pgbdev.projet12.mapper.AssociationMapper;
import com.pgbdev.projet12.repository.AssociationRepository;
import com.pgbdev.projet12.service.Scope;
import com.pgbdev.projet12.service.TagResolver;
import com.pgbdev.projet12.service.TagService;
import com.pgbdev.projet12.service.TerritoryService;
import com.pgbdev.projet12.technical.exception.request.InvalidTerritorySelectionException;
import com.pgbdev.projet12.technical.exception.resource.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssociationService {
    private final AssociationRepository associationRepository;
    private final TerritoryService territoryService;
    private final TagService tagService;
    private final TagResolver tagResolver;
    private final AssociationMapper associationMapper;

    public Association create(String name) {
        Association association = new Association(name);
        return associationRepository.save(association);
    }

    public AssociationResponse getAssociationById(UUID id) {
        Association association = associationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        Association.class,
                        "id",
                        id.toString()
                ));

        return associationMapper.toResponse(association);
    }

    @Transactional
    public void updateTags(UUID id, List<String> tagNames) {
        List<Long> tagIds = tagResolver.resolveIds(tagNames);

        Association association = associationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        Association.class,
                        "id",
                        id.toString()
                ));
        Set<Tag> tags = tagService.getTags(tagIds);

        association.getTags().clear();
        association.getTags().addAll(tags);
    }

    @Transactional
    public void updateDepartments(UUID id, Scope scope, List<String> departmentCodes, List<String> regionCodes) {
        if (scope == Scope.DEPARTMENTS && (departmentCodes == null || departmentCodes.isEmpty())) {
            throw new InvalidTerritorySelectionException(Department.class, "Au moins un code de département doit être fourni.");
        } else if (scope == Scope.REGIONS && (regionCodes == null || regionCodes.isEmpty())) {
            throw new InvalidTerritorySelectionException(Region.class, "Au moins un code de région doit être fourni.");
        }

        Association association = associationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        Association.class,
                        "id",
                        id.toString()
                ));
        Set<Department> departments = territoryService.resolveDepartments(scope, departmentCodes, regionCodes);

        association.getDepartments().clear();
        association.getDepartments().addAll(departments);
    }

    @Transactional
    public void delete(UUID id) {
        associationRepository.deleteById(id);
    }
}
