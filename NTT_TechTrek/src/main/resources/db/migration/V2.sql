SELECT setval(pg_get_serial_sequence('orders','id'), COALESCE(MAX(id), 0)) FROM orders;

INSERT INTO orders (customer_name, creation_date, status, responsible_employee_id)
VALUES
  ('Acme Corp',         now(), 'PENDING',     3),
  ('Globex Industries', now(), 'PROCESSING',  1),
  ('Soylent Co',        now(), 'DELIVERED',   2)
ON CONFLICT DO NOTHING;
