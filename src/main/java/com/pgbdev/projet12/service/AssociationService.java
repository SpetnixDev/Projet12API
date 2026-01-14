package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.auth.Association;
import com.pgbdev.projet12.repository.AssociationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
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
    public void delete(UUID associationId) {
        associationRepository.deleteById(associationId);
    }

    public Optional<Association> findById(UUID id) {
        return associationRepository.findById(id);
    }
}
