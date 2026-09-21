# Apollo 247 Clone — Project Guide

Next.js 13 (App Router) + TypeScript + MongoDB/Mongoose + Tailwind/shadcn.
Healthcare app: browse doctors by specialty, plus email/password auth.

## Architecture

- Routes and API handlers live under `app/`. API route handlers are
  `app/api/**/route.ts` (App Router — a file must be named `route.ts` to be a
  route; anything else there is inert).
- Shared logic lives in `lib/`: `lib/auth/` (JWT + `requireAuth`), `lib/db/`
  (`dbConnect` singleton + Mongoose models).
- UI components live in `components/` (`ui/` is shadcn/Radix — treat as
  generated, avoid hand-editing).

## Conventions

- Auth token: client stores JWT in `localStorage` under `authtoken` and sends
  `Authorization: Bearer <token>`. Keep this key name consistent across the app.
- Protected API routes call `requireAuth(request)` and return `auth.error` when
  present.
- API responses use `{ success: boolean, data?, error?, pagination? }`.
- Never hard-code secrets or connection strings. Use `process.env`; document new
  vars in `.env.example`.
- `JWT_SECRET` and `MONGODB_URI` are required; `JWT_SECRET` must be set in prod.

## Commands

```bash
npm run dev         # dev server
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm test            # vitest
npm run build       # production build
```

## Verify before done

Run lint, typecheck, test, and build. Tests must not require a live database
(mock or test pure logic). Add a regression test for every bug fix where
practical.
