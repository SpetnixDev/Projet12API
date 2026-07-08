CREATE TABLE IF NOT EXISTS user_subscriptions
(
    user_id        UUID        NOT NULL,
    association_id UUID        NOT NULL,
    subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (user_id, association_id),

    CONSTRAINT fk_user_subscriptions_user
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_user_subscriptions_association
        FOREIGN KEY (association_id) REFERENCES associations (id)
            ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user
    ON user_subscriptions (user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_association
    ON user_subscriptions (association_id);
