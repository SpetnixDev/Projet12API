package com.pgbdev.projet12.service.association;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.domain.Department;
import com.pgbdev.projet12.domain.Region;
import com.pgbdev.projet12.repository.AssociationRepository;
import com.pgbdev.projet12.service.Scope;
import com.pgbdev.projet12.service.TerritoryService;
import com.pgbdev.projet12.technical.exception.InvalidTerritorySelectionException;
import com.pgbdev.projet12.technical.exception.ResourceNotFoundException;
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

    public Association create(String name) {
        Association association = new Association(name);
        return associationRepository.save(association);
    }

    public Association getAssociationById(UUID id) {
        return associationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        Association.class,
                        "id",
                        id.toString(),
                        "Association not found"));
    }

    @Transactional
    public void updateDepartments(UUID id, Scope scope, List<String> departmentCodes, List<String> regionCodes) {
        if (scope == Scope.DEPARTMENTS && (departmentCodes == null || departmentCodes.isEmpty())) {
            throw new InvalidTerritorySelectionException(Department.class, "Au moins un code de département doit être fourni.");
        } else if (scope == Scope.REGIONS && (regionCodes == null || regionCodes.isEmpty())) {
            throw new InvalidTerritorySelectionException(Region.class, "Au moins un code de région doit être fourni.");
        }

        Association association = getAssociationById(id);

        Set<Department> departments = territoryService.resolveDepartments(scope, departmentCodes, regionCodes);

        association.getDepartments().clear();
        association.getDepartments().addAll(departments);
    }

    @Transactional
    public void delete(UUID id) {
        associationRepository.deleteById(id);
    }
}
