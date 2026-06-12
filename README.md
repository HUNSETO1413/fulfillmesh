# FulfillMesh

China-powered fulfillment matching platform for global e-commerce brands — a marketing
site plus an operational dashboard, built with **Next.js 16 (App Router) + React 19 +
Tailwind CSS 4 + TypeScript**.

## What's inside

- **Marketing site** — home, solutions, pricing, resources, blog, company and legal pages
  with per-page SEO metadata, `sitemap.xml`, `robots.txt` and Organization JSON-LD.
- **Operational dashboard** — orders, products, inventory, customers, suppliers, shipments,
  returns, quotes, invoices and QC inspections, all backed by a real data layer with
  working search, filtering and pagination.
- **Real backend** — a REST API (Next.js Route Handlers) over a PostgreSQL database, with
  cookie-based authentication and Edge middleware protecting the dashboard.

## Architecture

| Layer | Location | Notes |
| --- | --- | --- |
| Domain types | `src/types` | Single source of truth shared by API + UI |
| Database | `src/lib/db.ts` | PostgreSQL via `pg` (connection pool); schema + seed run once |
| Repositories | `src/lib/repositories.ts` | Async CRUD per entity, snake_case ↔ camelCase mapping |
| REST API | `src/app/api/**/route.ts` | Generated from `src/lib/api.ts` factories |
| Auth | `src/lib/password.ts`, `src/lib/session.ts`, `src/middleware.ts` | scrypt hashing (Node) + HMAC session tokens (Edge-safe) |
| SEO | `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` | `pageMetadata()` helper |
| Dashboard UI | `src/app/dashboard/**` | Server page loads data → client `*View` component renders it |

## Getting started

The fastest path is Docker (see below) — it brings up PostgreSQL, the app and a
reverse proxy together. For local development against your own Postgres:

```bash
npm install
cp .env.example .env.local   # set DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_SITE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The schema is created and seeded
automatically on first database access, so the dashboard works out of the box.

### Demo credentials

```
admin@fulfillmesh.com / demo1234
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (`node --test`) |

## Docker

A single command brings up the full three-container stack:

```bash
docker compose up --build -d
```

| Service | Image | Role |
| --- | --- | --- |
| `nginx` | nginx:alpine | Reverse proxy — public entrypoint on **http://localhost:8080** |
| `web` | built from `Dockerfile` | Next.js app (also exposed directly on :3000) |
| `db` | postgres:16-alpine | PostgreSQL, data persisted in the `fulfillmesh-pgdata` volume |

Startup is ordered by health checks (`db` → `web` → `nginx`). The database is seeded on
first run and survives restarts. Useful commands:

```bash
docker compose ps            # status (with health)
docker compose logs -f web   # app logs
docker compose down          # stop (keeps data)
docker compose down -v       # stop and wipe the database volume
```

## CI

`.github/workflows/ci.yml` runs type-check, lint, unit tests and a production build on
every push and pull request.
