package com.pgbdev.projet12.service.association.search.preprocessing;

import org.springframework.stereotype.Component;

import java.text.Normalizer;

@Component
public class DefaultTextNormalizer implements TextNormalizer {
    @Override
    public String normalize(String text) {
        if (text == null) {
            return "";
        }

        return Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
}
