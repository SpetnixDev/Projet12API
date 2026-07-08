CREATE TABLE IF NOT EXISTS user_association_supports
(
    user_id        UUID        NOT NULL,
    association_id UUID        NOT NULL,
    supported_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (user_id, association_id),

    CONSTRAINT fk_user_association_supports_user
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_user_association_supports_association
        FOREIGN KEY (association_id) REFERENCES associations (id)
            ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_association_supports_association
    ON user_association_supports (association_id);
