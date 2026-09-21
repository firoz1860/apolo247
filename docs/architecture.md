# Architecture

## Overview

The application is a single Next.js 13 (App Router) deployment that serves both
the frontend (React Server/Client Components) and the backend (Route Handlers
under `app/api/**`). Data is persisted in MongoDB through Mongoose.

```
Browser
  │  (fetch)
  ▼
Next.js App Router
  ├── UI pages  (app/**/page.tsx, components/**)
  └── API routes (app/api/**/route.ts)
        │
        ▼
   lib/ (auth, db)
        │
        ▼
     MongoDB (Mongoose models)
```

## Directory layout

| Path                 | Responsibility                                      |
| -------------------- | --------------------------------------------------- |
| `app/`               | Routes: pages + API route handlers                  |
| `app/api/auth/`      | Signup, login, logout, me, change-password          |
| `app/api/doctors/`   | Doctor list/create and single-doctor read/update/delete |
| `components/`        | Reusable UI (layout, doctors, shadcn `ui/`)         |
| `lib/auth/`          | JWT sign/verify + `requireAuth` request guard       |
| `lib/db/`            | `dbConnect` singleton + Mongoose models             |
| `scripts/`           | One-off seed scripts (env-driven, no secrets)       |
| `tests/`             | Vitest unit tests                                   |

## Authentication

- Passwords are hashed with `bcryptjs` in a Mongoose `pre('save')` hook.
- On login/signup the server issues a JWT (`{ userId }`, 7-day expiry) signed
  with `JWT_SECRET`.
- The client stores the token in `localStorage` (`authtoken`) and sends it as
  `Authorization: Bearer <token>` on authenticated requests.
- Login additionally sets an httpOnly `token` cookie; the logout route clears
  the auth cookies.
- Server-side, protected routes verify the bearer token via
  `lib/auth/requireAuth`. `JWT_SECRET` is mandatory in production — the signer
  refuses to fall back to a default there.

### Data flow: login

```
login page ──POST /api/auth/login──▶ verify user + bcrypt compare
    ◀── { token, user } ───────────── sign JWT
localStorage.authtoken = token
Header ──GET /api/auth/me (Bearer)──▶ returns profile → shows user name
```

## Database

- `dbConnect` caches the Mongoose connection on `global` to avoid connection
  leaks across hot-reloads (dev) and serverless invocations (prod).
- Models: `User` (auth + profile) and `Doctor` (listing + clinics +
  availability), both with indexes for common query/sort fields.

## Security decisions

- No secrets in source. Connection strings and the JWT secret come from
  environment variables; `.env` is git-ignored and `.env.example` documents the
  contract.
- Doctor mutations (POST/PUT/DELETE) require a valid JWT.
- `/api/auth/me` PUT strips `password` and `email` from the update payload to
  prevent privilege/identity changes through the profile endpoint.

## Known limitations / future work

See [development-plan.md](./development-plan.md). Notably: there is no
role-based authorization (any authenticated user can mutate doctors), no
appointment booking flow yet, and no email-based password reset (the
change-password flow requires the current password).
