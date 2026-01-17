INSERT INTO employee (id, first_name, last_name, role)
VALUES
    (1, 'John', 'Doe', 'MANAGER'),
    (2, 'Jane', 'Smith', 'SUPERVISOR'),
    (3, 'Alex', 'Johnson', 'STAFF')
    ON CONFLICT (id) DO NOTHING;

SELECT setval(
               pg_get_serial_sequence('employee','id'),
               COALESCE(MAX(id), 1),
               true
       ) FROM employee;

INSERT INTO users (id, username, password, role)
VALUES
    (1,'admin',    '$2a$10$c.o1a//AaE25NJB5x0PZuuAAtI4xy/DOtkUfkQCyeo6BeaGV4sGA2', 'ADMIN'),
    (2,'employee', '$2a$10$c.o1a//AaE25NJB5x0PZuuAAtI4xy/DOtkUfkQCyeo6BeaGV4sGA2', 'EMPLOYEE'),
    (3,'user',     '$2a$10$c.o1a//AaE25NJB5x0PZuuAAtI4xy/DOtkUfkQCyeo6BeaGV4sGA2', 'USER')
    ON CONFLICT (username) DO NOTHING;

SELECT setval(
               pg_get_serial_sequence('users','id'),
               COALESCE(MAX(id), 1),
               true
       ) FROM users;

INSERT INTO product (id, name, type, unit_of_measure, quantity, owner_username)
VALUES
    (1,'Potatoes',      'RAW_MATERIAL', 'kg', 150, 'user'),
    (2,'Sunflower Oil', 'RAW_MATERIAL', 'l',  60,  'user'),
    (3,'Salt',          'RAW_MATERIAL', 'kg', 25,  'user'),
    (4,'Paprika',       'RAW_MATERIAL', 'kg', 10,  'user'),
    (5,'Frozen Fries',  'SEMI_READY',   'kg', 80,  'user')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
               pg_get_serial_sequence('product','id'),
               COALESCE(MAX(id), 1),
               true
       ) FROM product;

INSERT INTO orders (id, customer_name, creation_date, status, responsible_employee_id)
VALUES
    (1,'Acme Corp',         now(), 'NEW',   3),
    (2,'Globex Industries', now(), 'NEW', 1),
    (3,'Soylent Co',        now(), 'NEW', 2);

SELECT setval(
               pg_get_serial_sequence('orders','id'),
               COALESCE(MAX(id), 1),
               true
       ) FROM orders;

INSERT INTO order_item (id, order_id, product_id, quantity, unit_price)
VALUES
    (1, 1, 1, 20, 1.5),
    (2, 1, 3, 2,  0.8),
    (3, 2, 5, 30, 2.2),
    (4, 3, 1, 50, 1.4);

SELECT setval(
               pg_get_serial_sequence('order_item','id'),
               COALESCE(MAX(id), 1),
               true
       ) FROM order_item;
