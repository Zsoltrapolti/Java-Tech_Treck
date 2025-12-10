-- users from auth
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL
);

-- employees
CREATE TABLE IF NOT EXISTS employee (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(255)
);

-- products
CREATE TABLE IF NOT EXISTS product (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255),
    unit_of_measure VARCHAR(100),
    quantity NUMERIC
);

-- stock entries
CREATE TABLE IF NOT EXISTS stock_entry (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES product(id),
    quantity NUMERIC
);

-- orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    creation_date TIMESTAMP,
    status VARCHAR(100),
    responsible_employee_id BIGINT REFERENCES employee(id)
);

-- Order items
CREATE TABLE IF NOT EXISTS order_item (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES product(id),
    quantity NUMERIC,
    unit_price NUMERIC
);

CREATE INDEX IF NOT EXISTS idx_order_item_order ON order_item(order_id);
CREATE INDEX IF NOT EXISTS idx_order_item_product ON order_item(product_id);
