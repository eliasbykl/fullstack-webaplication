-- CRUD-eksempler (Supabase/Postgres)

-- MENU ITEM
-- Create
INSERT INTO menu_item (name, description, price) VALUES ('Kremet Fiskesuppe', 'Dagens fangst med grønnsaker og urter', 195.00);

-- Read
SELECT id, name, description, price FROM menu_item WHERE is_available = TRUE ORDER BY name;

-- Update
UPDATE menu_item SET price = 205.00, updated_at = NOW() WHERE id = 1;

-- Delete
DELETE FROM menu_item WHERE id = 1;


-- BOOKING
-- Create
INSERT INTO booking (customer_name, email, phone, guests, booking_datetime, notes)
VALUES ('Ola Nordmann', 'ola@example.com', '12345678', 2, NOW() + INTERVAL '1 day', 'Vindusbord');

-- Read (kommende bookinger)
SELECT * FROM booking WHERE booking_datetime >= NOW() ORDER BY booking_datetime ASC;

-- Update status
UPDATE booking SET status = 'confirmed' WHERE id = 1;

-- Delete
DELETE FROM booking WHERE id = 1;


-- EMPLOYEE
-- Create
INSERT INTO employee (name, email, role) VALUES ('Admin Bruker', 'admin@example.com', 'admin');

-- Read
SELECT id, name, email, role FROM employee ORDER BY role, name;

-- Update
UPDATE employee SET role = 'staff', updated_at = NOW() WHERE email = 'admin@example.com';

-- Delete
DELETE FROM employee WHERE email = 'admin@example.com';
