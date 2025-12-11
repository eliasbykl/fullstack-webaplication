# Plan – Tangen Torv (Alternativ 1)

Dette prosjektet er en fullstack-løsning for restaurant Tangen Torv. Nettsiden skal presentere informasjon (konsept, åpningstider, kontakt), meny, bestilling av bord, og ha adminsider for ansatte til å se/administrere bestillinger.

Teknologistack
- Frontend: Next.js (App Router) + React + TypeScript
- Styling: Tailwind CSS
- Database: Supabase (Postgres i sky) – ingen Docker lokalt
- Backend: Next.js server actions/route handlers (Modul 3)

Milepæler (med dine labels)
- Prosjektoppsett: Next.js/TS og Tailwind Initiering — labels: `setup`, `modul-2-frontend` — Day 1
- Fullføre Plan.md og README.md (Dokumentasjon) — labels: `dokumentasjon` — Day 1
- Databasemodell: Utarbeid ER-diagram og DATABASE.md — labels: `modul-1-db`, `dokumentasjon` — Day 2
- Opprettelse av Supabase-prosjekt og tabeller — labels: `modul-1-db`, `setup` — Day 2
- SQL-skjema: Skriv schema.sql (booking, menu_item, employee) — labels: `modul-1-db` — Day 2
- SQL-spørringer: Dokumenter CRUD i queries.sql — labels: `modul-1-db`, `dokumentasjon` — Day 2

Omfang per modul
- Modul 1 (DB): ER-beskrivelse, schema.sql, queries.sql. Kjøres i Supabase SQL Editor (ikke Docker)
- Modul 2 (Web statisk): Sider for Hjem, Meny, Bestill, Admin – med statiske data/mock
- Modul 3 (Backend): Koble Next.js mot Supabase via supabase-js, Auth, RLS, adminsider

Datamodell (høy-nivå)
- booking: kundeinfo, tidspunkt, antall, status
- menu_item: rettens navn, beskrivelse, pris, tilgjengelighet
- employee: ansatte (for admin-roller ved senere autentisering)

Definition of Done
- Plan.md og README.md ferdige dag 1
- DATABASE.md + schema.sql + queries.sql ferdig dag 2 og verifisert i Supabase
- Modul 2: Synlige sider med statiske data
- Jevnlige commits med meningsfulle meldinger

Kjøring lokalt (foreløpig)
- Frontend: `cd web-application && npm install && npm run dev` og åpne http://localhost:3000
- Supabase: Opprett prosjekt, legg inn environment-variabler i `.env.local` og test spørringer i SQL Editor
