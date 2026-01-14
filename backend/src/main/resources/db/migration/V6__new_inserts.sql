DELETE FROM user_products;
DELETE FROM order_item;
DELETE FROM orders;
DELETE FROM stock_entry;
DELETE FROM product;
DELETE FROM employee;
DELETE FROM users;
DELETE FROM account_request;

ALTER TABLE employee
DROP COLUMN IF EXISTS user_id;


SELECT setval(pg_get_serial_sequence('users','id'), 1, false);
SELECT setval(pg_get_serial_sequence('employee','id'), 1, false);
SELECT setval(pg_get_serial_sequence('product','id'), 1, false);
SELECT setval(pg_get_serial_sequence('orders','id'), 1, false);
SELECT setval(pg_get_serial_sequence('order_item','id'), 1, false);
SELECT setval(pg_get_serial_sequence('stock_entry','id'), 1, false);
SELECT setval(pg_get_serial_sequence('account_request','id'), 1, false);

INSERT INTO users (username, password, role)
VALUES (
           'admin@krumpi.ro',
           '$2a$10$c.o1a//AaE25NJB5x0PZuuAAtI4xy/DOtkUfkQCyeo6BeaGV4sGA2',
           'ADMIN'
       ),
       (
           'employee@krumpi.ro',
           '$2a$10$c.o1a//AaE25NJB5x0PZuuAAtI4xy/DOtkUfkQCyeo6BeaGV4sGA2',
           'EMPLOYEE'
       ),
       (
           'user@krumpi.ro',
           '$2a$10$c.o1a//AaE25NJB5x0PZuuAAtI4xy/DOtkUfkQCyeo6BeaGV4sGA2',
           'USER'
       );

INSERT INTO employee (first_name, last_name, role)
VALUES
    ('John', 'Doe', 'STAFF'),
    ('Jane', 'Smith', 'STAFF'),
    ('Alex', 'Johnson', 'STAFF');

INSERT INTO product (name, type, unit_of_measure, quantity, owner_username)
VALUES
    ('Potatoes',      'RAW_MATERIAL', 'kg', 150, 'admin@krumpi.ro'),
    ('Sunflower Oil', 'RAW_MATERIAL', 'l',  60,  'admin@krumpi.ro'),
    ('Salt',          'RAW_MATERIAL', 'kg', 25,  'admin@krumpi.ro'),
    ('Paprika',       'RAW_MATERIAL', 'kg', 10,  'admin@krumpi.ro'),
    ('Frozen Fries',  'SEMI_READY',   'kg', 80,  'admin@krumpi.ro');

INSERT INTO orders (customer_name, creation_date, status, responsible_employee_id)
VALUES
    ('Acme Corp',         now(), 'NEW', 3),
    ('Globex Industries', now(), 'NEW', 1),
    ('Soylent Co',        now(), 'NEW', 2);

INSERT INTO order_item (order_id, product_id, quantity, unit_price)
VALUES
    (1, 1, 20, 1.5),
    (1, 3, 2,  0.8),
    (2, 5, 30, 2.2),
    (3, 1, 50, 1.4);
