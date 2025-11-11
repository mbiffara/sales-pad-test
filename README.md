# sales-pad-api

Simple Express + TypeScript API scaffold for Sales Pad.

## Getting Started

1. Copy `.env.example` to `.env` and adjust values (at minimum `PORT` and `DATABASE_URL`).
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## Available Scripts

- `npm run dev` – start the API with autoreload.
- `npm run build` – compile TypeScript into `dist`.
- `npm start` – run the compiled server.
- `npm run typecheck` – type-check without emitting files.
- `npm test` – placeholder that runs Node's built-in test runner.
- `npm run db:generate` – create SQL migrations from the definitions in `src/db/schema.ts`.
- `npm run db:push` – apply the latest schema to the database defined by `DATABASE_URL`.

## Database

- Drizzle ORM + PostgreSQL power the data layer (`src/db`).
- Configure the connection through `DATABASE_URL` (and optional `DATABASE_POOL_SIZE`).
- Add or update tables inside `src/db/schema.ts` and run the Drizzle scripts above to generate/apply migrations.

## Background Jobs

- PgBoss is pre-configured in `src/workers/boss.ts` and starts with the HTTP server.
- Jobs use the same Postgres connection by default; override with `BOSS_DATABASE_URL` if you prefer a dedicated queue database.
- Import helpers from `src/jobs` to schedule or process workers (e.g., the lead message sender job).

## API

- Endpoints live under `src/api`, grouped by version (e.g. `src/api/v1`).
- `GET /` – root route describing the service.
- `GET /api/v1/health` – health probe including uptime and timestamp.
- `GET /api/v1/lead/:id` – fetch a single lead by numeric id.
- `POST /api/v1/lead` – create a lead (`name` + at least one of `email` or `phoneNumber`).
- `POST /api/v1/send` – enqueue a background job to email a lead (`leadId`, `subject`, `body`).
- `POST /api/v1/reply` – enqueue a background job that records a lead-authored email reply (`email`, `body`, optional `subject`).
