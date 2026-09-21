# Apollo 247 Clone

A healthcare web app (Apollo 247 style) for browsing doctors by specialty and
managing a user account. Built with **Next.js 13 (App Router)**, **TypeScript**,
**MongoDB/Mongoose**, and **Tailwind CSS + shadcn/ui**.

## Features

- **Authentication** — email/password signup, login, logout, "me" profile
  lookup, and change-password, backed by JWT.
- **Doctors service** — list/filter/sort/paginate doctors, fetch a single
  doctor, and (authenticated) create/update/delete doctors.
- **Specialty pages** — cardiology, dentistry, neurology, orthopedics,
  pediatrics, ophthalmology, general physician / internal medicine.
- Responsive UI with loading, empty, and error states.

## Tech stack

| Layer     | Choice                                        |
| --------- | --------------------------------------------- |
| Framework | Next.js 13.5 (App Router) + React 18          |
| Language  | TypeScript (strict)                           |
| Database  | MongoDB via Mongoose                           |
| Auth      | JWT (`jsonwebtoken`) + `bcryptjs` password hash |
| UI        | Tailwind CSS, shadcn/ui (Radix), lucide-react |
| Tests     | Vitest                                        |

## Getting started

### Prerequisites

- Node.js 18+ (project developed on Node 24)
- A MongoDB instance (local `mongod` or MongoDB Atlas)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#   then edit .env and set MONGODB_URI and JWT_SECRET

# 3. (Optional) seed sample data
npm run seed:doctors          # requires MONGODB_URI in your shell/.env
node scripts/seedUser.js      # creates a demo user

# 4. Run the dev server
npm run dev                   # http://localhost:3000
```

### Environment variables

See [`.env.example`](./.env.example). The important ones:

- `MONGODB_URI` — MongoDB connection string.
- `JWT_SECRET` — secret used to sign auth tokens. **Required in production.**

## Scripts

| Script                  | Description                          |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start the dev server                |
| `npm run build`         | Production build                    |
| `npm start`             | Start the production server         |
| `npm run lint`          | ESLint                              |
| `npm run typecheck`     | TypeScript type checking (no emit)  |
| `npm test`              | Run the Vitest suite                |
| `npm run seed:doctors`  | Seed sample doctors                 |

## API overview

| Method            | Route                       | Auth      | Purpose                     |
| ----------------- | --------------------------- | --------- | --------------------------- |
| POST              | `/api/auth/signup`          | –         | Register a new user         |
| POST              | `/api/auth/login`           | –         | Log in, returns a JWT       |
| POST              | `/api/auth/logout`          | –         | Clear auth cookies          |
| GET / PUT         | `/api/auth/me`              | Bearer    | Read / update own profile   |
| POST              | `/api/auth/change-password` | Bearer    | Change password             |
| GET               | `/api/doctors`              | –         | List/filter/sort doctors    |
| POST              | `/api/doctors`              | Bearer    | Create a doctor             |
| GET               | `/api/doctors/:id`          | –         | Get one doctor              |
| PUT / DELETE      | `/api/doctors/:id`          | Bearer    | Update / delete a doctor    |

Authenticated requests send `Authorization: Bearer <token>`.

## Documentation

- [Architecture](./docs/architecture.md)
- [Development plan](./docs/development-plan.md)

## Testing

```bash
npm test
```

Unit tests cover the JWT helpers and the request auth guard. They run without a
database.
