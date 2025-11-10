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

## API

- `GET /` – root route describing the service.
- `GET /api/v1/health` – health probe including uptime and timestamp.
