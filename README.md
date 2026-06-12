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
- **Real backend** — a REST API (Next.js Route Handlers) over a SQLite database, with
  cookie-based authentication and Edge middleware protecting the dashboard.

## Architecture

| Layer | Location | Notes |
| --- | --- | --- |
| Domain types | `src/types` | Single source of truth shared by API + UI |
| Database | `src/lib/db.ts` | Built-in `node:sqlite` (Node 24, zero native deps); auto-seeded |
| Repositories | `src/lib/repositories.ts` | CRUD per entity, snake_case ↔ camelCase mapping |
| REST API | `src/app/api/**/route.ts` | Generated from `src/lib/api.ts` factories |
| Auth | `src/lib/password.ts`, `src/lib/session.ts`, `src/middleware.ts` | scrypt hashing (Node) + HMAC session tokens (Edge-safe) |
| SEO | `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` | `pageMetadata()` helper |
| Dashboard UI | `src/app/dashboard/**` | Server page loads data → client `*View` component renders it |

## Getting started

```bash
npm install
cp .env.example .env.local   # set AUTH_SECRET and NEXT_PUBLIC_SITE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The SQLite database (`data/fulfillmesh.db`) is created and seeded automatically on first
run, so the dashboard works out of the box.

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

```bash
docker compose up
```

## CI

`.github/workflows/ci.yml` runs type-check, lint, unit tests and a production build on
every push and pull request.
