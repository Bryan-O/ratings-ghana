# RatingsGhana

A platform where people in Ghana rate and review businesses, both physical shops and online sellers, and the customer service they provide.

Trust is the product, so every reviewer must:
- verify their **email**;
- verify a **Ghana mobile number by SMS code** (one account per number);
- stick to **one review per business**, which they can edit later.

Users can suggest missing businesses, and an admin approves them before they go live.

Design: [Figma — RatingsGhana](https://www.figma.com/design/7369kBlLR6ZW71vrRPGJvq/RatingsGhana)

## Stack

- Next.js 16 (App Router, server actions) + TypeScript + Tailwind CSS 4
- PostgreSQL + Prisma 7 (`@prisma/adapter-pg`)
- Auth.js v5: email/password plus optional Google, with JWT sessions
- SMS via Arkesel, email via Resend (both swapped for a local outbox file in development)
- Vitest for unit tests, Playwright for end-to-end tests

## Local development

Requirements: Node 20+ and PostgreSQL 14+.

```bash
npm install                      # also runs prisma generate
cp .env.example .env             # then set AUTH_SECRET (npx auth secret)
createdb ratings_ghana           # or point DATABASE_URL at any Postgres
npm run db:migrate               # apply migrations
npm run db:seed                  # businesses + admin (+ demo reviews if SEED_DEMO_DATA=true)
npm run dev                      # http://localhost:3000
```

**Dev outbox:** with `SMS_PROVIDER=console` and no `RESEND_API_KEY`, verification codes and email links are printed to the server console. They are also appended to `.dev-outbox.log`.

**Seeded accounts:**
- admin `admin@ratingsghana.local` / `ChangeMe123!`, which opens `/admin`;
- demo reviewers `john@example.com` … / `Password123`.

**Business photos:** verified users (email + phone) upload photos from a business page under **Add photos**. Each photo goes to `/admin` for approval before it appears. Uploads are resized and converted to WebP, and all metadata (including GPS location) is stripped. In development they're stored in `.uploads/`. You can also put photos you have the rights to in `public/images/businesses/<slug>/` and re-run `npm run db:seed`. Businesses without photos show a branded placeholder tile.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build (type-checks) |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright; starts `next dev` on port 3100; needs a migrated + seeded DB) |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Seed businesses/admin/demo data |

## Deploying (Vercel + Neon)

1. Create a Neon project and copy its **pooled** connection string.
2. Import the repo in Vercel and set these environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL` (your production URL)
   - `RESEND_API_KEY` and `EMAIL_FROM` (from a verified Resend domain)
   - `SMS_PROVIDER=arkesel`, `ARKESEL_API_KEY` and `ARKESEL_SENDER_ID` (register the sender ID with Arkesel)
   - optionally `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
   - for photo uploads: in Vercel go to **Storage → Create → Blob**, connect the store to the project (this sets `BLOB_READ_WRITE_TOKEN`), and set `STORAGE_PROVIDER=vercel-blob`
3. Run migrations against Neon: `DATABASE_URL=... npx prisma migrate deploy`.
4. Seed businesses and the admin with a strong password, **without demo data**:
   `DATABASE_URL=... SEED_ADMIN_PASSWORD=... SEED_DEMO_DATA=false npm run db:seed`.

In production the app refuses to fall back to the console SMS or email outbox (or local photo storage), so a missing key fails loudly instead of silently skipping verification.
