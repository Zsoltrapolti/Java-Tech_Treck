INSERT INTO employee (id, first_name, last_name, role)
VALUES
  (1, 'John', 'Doe', 'MANAGER'),
  (2, 'Jane', 'Smith', 'SUPERVISOR'),
  (3, 'Alex', 'Johnson', 'STAFF')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('employee', 'id'),
    COALESCE(MAX(id), 0) + 1,
    false
) FROM employee;


INSERT INTO orders (customer_name, creation_date, status, responsible_employee_id)
VALUES
  ('Acme Corp', now(), 'PENDING', 3),
  ('Globex Industries', now(),'PROCESSING',1),
  ('Soylent Co', now(), 'DELIVERED',2)
ON CONFLICT DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('orders','id'),
  COALESCE(MAX(id), 1),
  MAX(id) IS NOT NULL
) FROM orders;