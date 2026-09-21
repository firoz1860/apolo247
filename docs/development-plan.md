# Development Plan

## Status legend

- ✅ done
- 🚧 in progress
- ⬜ planned

## Phase 1 — Stabilize auth & core services (this PR)

- ✅ Fix broken change-password page (wrong token key + wrong endpoint)
- ✅ Fix Header: broken "General Physician" link and user-name display
- ✅ Fix `next.config.js` duplicate `images` key / invalid image domains
- ✅ Remove stray `"type": "module"` from `package.json` scripts
- ✅ Remove hard-coded MongoDB credentials from seed script (env-driven)
- ✅ Ignore `.env` files in git; add `.env.example`
- ✅ Require `JWT_SECRET` in production
- ✅ Harden `dbConnect` with a cached global connection
- ✅ Require auth for doctor create/update/delete
- ✅ Header now validates the token via `/api/auth/me` and shows the real name
- ✅ Surface real signup errors in the UI
- ✅ Add Vitest unit tests (jwt, requireAuth) + CI workflow
- ✅ Add README + architecture docs + seed scripts

## Phase 2 — Product completeness

Delivered as one PR per subsystem, stacked in dependency order.

- ✅ **Appointment booking** (model + Zod-validated API + UI + tests)
  - `Appointment` model with a partial-unique index preventing double-booking
  - `GET /api/doctors/:id/slots`, `POST/GET /api/appointments`,
    `GET/PATCH /api/appointments/:id` (owner-scoped, cancel/reschedule)
  - Doctor detail page (`/doctors/:id`) with a booking panel + "My
    Appointments" page (`/appointments`)
- ✅ Doctor detail page consuming `/api/doctors/:id`
- ✅ **Guest login** — `POST /api/auth/guest` issues a real JWT for a
  throwaway guest account; "Continue as guest" on the login page
- ✅ **Pharmacy** — `Product`/`Order` models, catalog API, `/pharmacy`
  catalog with search + localStorage cart, `/pharmacy/cart` mock checkout
- ✅ **Lab tests** — `LabTest`/`LabBooking` models, catalog API,
  `/lab-tests` with date-based booking
- ✅ **Health Records** — auth-gated `/health-records` (profile + history)
- ✅ **Navigation wired** — top bar + main nav point to real routes
  (Consult → /find-doctors, Pharmacy, Lab Tests, Health Records)
- 🚧 User dashboard / profile (edit profile + medical history)
- 🚧 Doctor reviews & ratings (feed the existing rating sort)
- 🚧 Order/lab-booking management pages (list + cancel)
- ⬜ Wire `FilterSidebar` / `SortOptions` to real query params end-to-end
- ⬜ Email-based password reset (separate from change-password)
- ⬜ Persist auth as httpOnly cookie only (drop localStorage) and read it
      server-side for a consistent session model

## Phase 3 — Hardening & scale

- ⬜ Role-based authorization (admin vs patient) for doctor management
- ⬜ Rate limiting on auth endpoints
- ⬜ Zod request validation on all API routes
- ⬜ Integration tests against an in-memory MongoDB
- ⬜ Observability (structured logging, error reporting)

## Security backlog

- ⚠️ **Rotate the MongoDB Atlas credentials** that were previously committed in
  `scripts/seedUser.js` — they are in git history and must be considered
  compromised. This requires access to the Atlas project and is out of scope
  for automated changes.
