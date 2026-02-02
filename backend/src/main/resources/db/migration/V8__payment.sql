CREATE TABLE payment (
                         id BIGSERIAL PRIMARY KEY,
                         amount DOUBLE PRECISION,
                         method VARCHAR(50),
                         status VARCHAR(50),
                         transaction_id VARCHAR(255),
                         payment_date TIMESTAMP,
                         user_id BIGINT REFERENCES users(id),
                         invoice_id BIGINT UNIQUE REFERENCES invoice_record(id)
);

SELECT setval(pg_get_serial_sequence('payment','id'), 1, false);
