CREATE TABLE IF NOT EXISTS account_request (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL,
    assigned_role VARCHAR(50)
);

SELECT setval(
               pg_get_serial_sequence('account_request','id'),
               COALESCE(MAX(id), 1),
               true
       ) FROM account_request;
