package com.pgbdev.projet12.service;

import com.pgbdev.projet12.domain.Association;
import com.pgbdev.projet12.domain.User;
import com.pgbdev.projet12.dto.response.AssociationResponse;
import com.pgbdev.projet12.dto.response.UserResponse;
import com.pgbdev.projet12.mapper.AssociationMapper;
import com.pgbdev.projet12.repository.AssociationRepository;
import com.pgbdev.projet12.repository.UserRepository;
import com.pgbdev.projet12.technical.exception.resource.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AssociationRepository associationRepository;
    private final AssociationMapper associationMapper;

    public User create(String username) {
        User user = new User(username);
        return userRepository.save(user);
    }

    @Transactional
    public void delete(UUID id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, "id", id));

        return new UserResponse(user.getId(), user.getUsername());
    }

    @Transactional
    public void subscribe(UUID userId, UUID associationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, "id", userId));

        Association association = associationRepository.findById(associationId)
                .orElseThrow(() -> new ResourceNotFoundException(Association.class, "id", associationId));

        user.getSubscriptions().add(association);
    }

    @Transactional
    public void unsubscribe(UUID userId, UUID associationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, "id", userId));

        user.getSubscriptions().removeIf(association -> association.getId().equals(associationId));
    }

    @Transactional(readOnly = true)
    public List<AssociationResponse> getSubscriptions(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, "id", userId));

        List<Association> associations = user.getSubscriptions().stream().toList();
        Map<UUID, Long> supportCounts = getSupportCounts(associations);

        return associationMapper.toResponseList(associations, supportCounts);
    }

    @Transactional
    public void support(UUID userId, UUID associationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, "id", userId));

        Association association = associationRepository.findById(associationId)
                .orElseThrow(() -> new ResourceNotFoundException(Association.class, "id", associationId));

        user.getSupportedAssociations().add(association);
    }

    @Transactional
    public void unsupport(UUID userId, UUID associationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, "id", userId));

        user.getSupportedAssociations().removeIf(association -> association.getId().equals(associationId));
    }

    @Transactional(readOnly = true)
    public List<AssociationResponse> getSupports(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(User.class, "id", userId));

        List<Association> associations = user.getSupportedAssociations().stream().toList();
        Map<UUID, Long> supportCounts = getSupportCounts(associations);

        return associationMapper.toResponseList(associations, supportCounts);
    }

    private Map<UUID, Long> getSupportCounts(List<Association> associations) {
        List<UUID> associationIds = associations.stream()
                .map(Association::getId)
                .toList();

        if (associationIds.isEmpty()) {
            return Map.of();
        }

        return userRepository.countSupportsByAssociationIds(associationIds).stream()
                .collect(Collectors.toMap(
                        UserRepository.AssociationSupportCount::getAssociationId,
                        UserRepository.AssociationSupportCount::getSupportCount
                ));
    }
}

