ALTER TABLE invoice_record
    ADD COLUMN client_name VARCHAR(255),
    ADD COLUMN client_address VARCHAR(255),
    ADD COLUMN client_city VARCHAR(100),
    ADD COLUMN client_county VARCHAR(100),
    ADD COLUMN client_zip VARCHAR(20);