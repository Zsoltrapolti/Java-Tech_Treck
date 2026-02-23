ALTER TABLE invoice_record
    ADD COLUMN due_date TIMESTAMP;

ALTER TABLE invoice_record ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;