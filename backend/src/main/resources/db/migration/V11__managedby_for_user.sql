ALTER TABLE users
    ADD COLUMN IF NOT EXISTS managed_by_employee_id BIGINT REFERENCES employee(id);

UPDATE users
SET managed_by_employee_id = 2
WHERE username = 'user@krumpi.ro';
