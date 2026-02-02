ALTER TABLE product
    ADD COLUMN price DOUBLE PRECISION DEFAULT 0.0;

UPDATE product SET price = 5.50 WHERE name = 'Potatoes';
UPDATE product SET price = 8.20 WHERE name = 'Sunflower Oil';
UPDATE product SET price = 2.00 WHERE name = 'Salt';
UPDATE product SET price = 45.00 WHERE name = 'Paprika';
UPDATE product SET price = 12.50 WHERE name = 'Frozen Fries';

CREATE TABLE shopping_cart (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT UNIQUE NOT NULL REFERENCES users(id)
);

CREATE TABLE cart_item (
                           id BIGSERIAL PRIMARY KEY,
                           cart_id BIGINT NOT NULL REFERENCES shopping_cart(id),
                           product_id BIGINT NOT NULL REFERENCES product(id),
                           quantity INTEGER NOT NULL CHECK (quantity > 0)
);

DROP TABLE IF EXISTS user_products;

CREATE TABLE IF NOT EXISTS invoice_record (
                                                id BIGSERIAL PRIMARY KEY,
                                                series_number VARCHAR(255) UNIQUE NOT NULL,
                                                issued_at TIMESTAMP,
                                                user_id BIGINT REFERENCES users(id),
                                                total_net DOUBLE PRECISION,
                                                total_vat DOUBLE PRECISION,
                                                total_gross DOUBLE PRECISION,
                                                status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS invoice_line (
                                                id BIGSERIAL PRIMARY KEY,
                                                invoice_record_id BIGINT NOT NULL REFERENCES invoice_record(id),
                                                product_name VARCHAR(255),
                                                unit_of_measure VARCHAR(50),
                                                price_per_unit DOUBLE PRECISION,
                                                quantity INTEGER,
                                                line_total_value DOUBLE PRECISION
);
SELECT setval(pg_get_serial_sequence('shopping_cart','id'), 1, false);
SELECT setval(pg_get_serial_sequence('cart_item','id'), 1, false);
SELECT setval(pg_get_serial_sequence('invoice_record','id'), 1, false);
SELECT setval(pg_get_serial_sequence('invoice_line','id'), 1, false);