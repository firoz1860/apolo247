# Apollo 247 Clone

A healthcare web app (Apollo 247 style) for browsing doctors by specialty and
managing a user account. Built with **Next.js 13 (App Router)**, **TypeScript**,
**MongoDB/Mongoose**, and **Tailwind CSS + shadcn/ui**.

## Features

- **Authentication** — email/password signup, login, logout, "me" profile
  lookup, and change-password, backed by JWT.
- **Doctors service** — list/filter/sort/paginate doctors, fetch a single
  doctor, and (authenticated) create/update/delete doctors.
- **Appointment booking** — doctor detail page with clinic/date/slot
  selection, server-computed availability (no double-booking), and a
  "My Appointments" page to cancel or reschedule.
- **Pharmacy** — product catalog with search/categories, a cart, and a
  mock checkout that persists an order.
- **Lab tests** — diagnostic-test catalog with date-based booking.
- **Health records** — authenticated view of profile + medical history.
- **Guest login** — try authenticated features instantly with a
  throwaway guest account (real JWT), no signup required.
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
| POST              | `/api/auth/guest`           | –         | Start a guest session (JWT) |
| POST              | `/api/auth/logout`          | –         | Clear auth cookies          |
| GET / PUT         | `/api/auth/me`              | Bearer    | Read / update own profile   |
| POST              | `/api/auth/change-password` | Bearer    | Change password             |
| GET               | `/api/doctors`              | –         | List/filter/sort doctors    |
| POST              | `/api/doctors`              | Bearer    | Create a doctor             |
| GET               | `/api/doctors/:id`          | –         | Get one doctor              |
| PUT / DELETE      | `/api/doctors/:id`          | Bearer    | Update / delete a doctor    |
| GET               | `/api/doctors/:id/slots`    | –         | Bookable slots for a date   |
| GET               | `/api/appointments`         | Bearer    | List own appointments       |
| POST              | `/api/appointments`         | Bearer    | Book an appointment         |
| GET               | `/api/appointments/:id`     | Bearer    | Get own appointment         |
| PATCH             | `/api/appointments/:id`     | Bearer    | Cancel / reschedule         |
| GET               | `/api/products`             | –         | List pharmacy products      |
| POST              | `/api/orders`               | Bearer    | Place an order (mock pay)   |
| GET               | `/api/orders`               | Bearer    | List own orders             |
| GET               | `/api/lab-tests`            | –         | List lab tests              |
| POST              | `/api/lab-bookings`         | Bearer    | Book a lab test             |
| GET               | `/api/lab-bookings`         | Bearer    | List own lab bookings       |
| GET               | `/api/doctors/:id/reviews`  | –         | List a doctor's reviews     |
| POST              | `/api/doctors/:id/reviews`  | Bearer    | Add/update your review      |
| PUT               | `/api/auth/me`              | Bearer    | Update your profile         |

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
