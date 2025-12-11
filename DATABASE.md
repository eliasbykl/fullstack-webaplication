# DATABASE.md – Supabase (Modul 1)

Denne modulen bruker Supabase (Postgres i sky). Ingen Docker lokalt.

Oppsett (Supabase)
1) Opprett et prosjekt på https://app.supabase.com
2) Noter Project URL og Keys (Settings → API):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - (valgfritt for server): SUPABASE_SERVICE_ROLE_KEY (kun serverside)
3) Åpne SQL Editor og kjør innholdet fra `db/schema.sql`, deretter eventuelle seed-setninger (kan limes inn manuelt)
4) Aktiver Row Level Security (RLS) på tabeller og legg til policies (skisser under)

Datamodell (ER – tekstlig)
- booking: id, customer_name, email, phone, guests, booking_datetime, notes, status, created_at
- menu_item: id, name, description, price, is_available, created_at, updated_at
- employee: id, name, email, role, created_at, updated_at

SQL-filer
- `db/schema.sql`: tabeller og relasjoner
- `db/queries.sql`: dokumenterte spørringer (CRUD)

Miljøvariabler i Next.js
Opprett `web-application/.env.local`:
- NEXT_PUBLIC_SUPABASE_URL=…
- NEXT_PUBLIC_SUPABASE_ANON_KEY=…
- SUPABASE_SERVICE_ROLE_KEY=… (kun på server, ikke i klientkode)

RLS og policies (skisse)
- menu_item: SELECT for alle (public) – slik at meny kan vises uten innlogging
- booking: INSERT tillates for anonyme (gjester) for å legge inn booking; SELECT/UPDATE begrenses til authenticated roller (employee/admin)
- employee: SELECT/INSERT/UPDATE begrenses til authenticated admin

Se også `db/queries.sql` for eksempler som kan testes i Supabase SQL Editor.
