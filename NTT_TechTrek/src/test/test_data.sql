-- This file runs before tests if you have spring.sql.init.mode=always
INSERT INTO product (name, price, quantity) VALUES
('Test Product 1', 10.99, 100),
('Test Product 2', 20.50, 50);