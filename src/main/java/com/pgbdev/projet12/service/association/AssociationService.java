package com.pgbdev.projet12.service.association;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.repository.AssociationRepository;
import com.pgbdev.projet12.technical.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssociationService {
    private final AssociationRepository associationRepository;

    public Association create(String name) {
        Association association = new Association(name);
        return associationRepository.save(association);
    }

    @Transactional
    public void delete(UUID id) {
        associationRepository.deleteById(id);
    }

    public Association getAssociationById(UUID id) {
        return associationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        Association.class,
                        "id",
                        id.toString(),
                        "Association not found"));
    }
}
