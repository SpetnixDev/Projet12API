package com.pgbdev.projet12.service.association.search.preprocessing;

import java.util.List;

public interface Tokenizer {
    List<String> tokenize(String text);
}
