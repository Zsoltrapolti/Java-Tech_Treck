ALTER TABLE employee
ADD COLUMN total_leave_days INTEGER NOT NULL DEFAULT 21,
ADD COLUMN used_leave_days INTEGER NOT NULL DEFAULT 0;

CREATE TABLE leave_request (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    requested_days INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE
);