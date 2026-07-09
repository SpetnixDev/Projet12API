ALTER TABLE associations
    ADD COLUMN phone_number             VARCHAR(20),
    ADD COLUMN contact_email            VARCHAR(255),
    ADD COLUMN address                  VARCHAR(500),
    ADD COLUMN website_url              VARCHAR(255),
    ADD COLUMN rna_number               VARCHAR(50),
    ADD COLUMN donation_use_description VARCHAR(2000);