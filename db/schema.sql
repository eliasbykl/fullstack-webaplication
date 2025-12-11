-- Supabase Postgres schema (uten Docker)

-- Menyelementer
CREATE TABLE IF NOT EXISTS menu_item (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Booking
CREATE TABLE IF NOT EXISTS booking (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guests INT NOT NULL CHECK (guests > 0),
  booking_datetime TIMESTAMPTZ NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ansatte (for admin)
CREATE TABLE IF NOT EXISTS employee (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('staff','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggere for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_menu_item_updated BEFORE UPDATE ON menu_item
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_employee_updated BEFORE UPDATE ON employee
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
