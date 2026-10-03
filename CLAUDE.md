# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## Project

**RatingsGhana** is a platform where people in Ghana star-rate (1–5) and review businesses, both physical shops and online sellers, and the customer service they give.

The product's core value is **trustworthy reviews**. Anti-fake-review measures are product-critical, not optional. Treat any change that weakens them as a bug.

MVP scope:
- real, verified user accounts;
- an inventory of Ghanaian businesses (seeded, plus user-suggested listings approved by an admin);
- search;
- star ratings and written reviews.

## Design source of truth

Figma file: `7369kBlLR6ZW71vrRPGJvq` ("RatingsGhana").
https://www.figma.com/design/7369kBlLR6ZW71vrRPGJvq/RatingsGhana

| Page | Route | Desktop frame | Mobile frame |
|---|---|---|---|
| Homepage | `/` | `2:2` | `225:284` |
| Businesses list | `/businesses` | `67:6` | `225:285` |
| Business details | `/businesses/[slug]` | `82:174` | `225:286` |
| Register | `/register` | `195:196` | `225:287`, email step `244:124` |
| Login | `/login` | `214:244` | `225:288` |
| Mobile nav menu | (header) | — | `240:133` |

- Before building or changing UI, pull the frame with the Figma MCP (`get_design_context`, `get_screenshot`).
- Desktop frames are **1512px** wide; mobile frames are **390px**.
- Typeface is **Inter**. The palette is neutral: near-black primary buttons, outlined secondary buttons, light grey page background, rounded image corners.
- The design copy says "Yelp's Terms of Service". **Never ship "Yelp" text**; use "RatingsGhana's".
- Pages with no Figma frame (`/verify-phone`, `/businesses/new`, `/admin`) reuse the same visual language: the auth-card style for forms, the header and breadcrumb style for pages.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL (Neon in production, local Postgres 16 in development)
- Auth.js v5 (Google + email/password), zod for validation, bcrypt for passwords
- Vitest (unit) and Playwright (e2e and visual checks; Chromium is preinstalled in cloud sessions, so never run `playwright install`)
- Deployed on Vercel

## Commands

_The project is being scaffolded. This section is finalised once the scripts exist._

```bash
npm run dev            # start dev server (http://localhost:3000)
npm run lint           # ESLint
npm test               # Vitest unit tests
npm run build          # production build (also type-checks)
npx prisma migrate dev # apply/create migrations against DATABASE_URL
npx prisma db seed     # seed businesses, demo reviews, admin user
```

## Architecture

```
app/                 routes (server components by default)
components/          shared UI (SiteHeader, BusinessCard, StarRating, ReviewCard, ...)
lib/
  db.ts              Prisma client singleton
  auth.ts            Auth.js config
  phone.ts           Ghana phone normalisation/validation (E.164 +233)
  sms.ts             SMS provider adapter (console | arkesel)
  email.ts           email sending (Resend)
  validation.ts      zod schemas
  actions/           server actions — ALL mutations live here
prisma/
  schema.prisma
  seed.ts
```

- All writes go through **server actions in `lib/actions/*`**, validated with zod. There is no DB access from client components.
- Use server components by default. Add `"use client"` only for interactive pieces (star input, forms, mobile menu).

## Trust and safety rules (must not regress)

1. Creating or editing a review requires a session, a **verified email** and a **verified phone**, all checked **server-side** in the action rather than only in the UI.
2. Phone numbers are **unique per account**, stored as E.164 (`+233…`). OTP codes are **hashed**, expire after 10 minutes, allow max 5 attempts per code and max 5 sends per hour per user.
3. **One review per user per business**, enforced by a unique DB constraint; users edit rather than duplicate.
4. `Business.avgRating` / `reviewCount` are recomputed **in the same transaction** as any review write.
5. User-suggested businesses are `PENDING` and invisible to the public until an admin approves them.
6. Admin pages and actions check `role === "ADMIN"` **server-side**.
7. Reviews per user are rate-limited, and reviews can be reported into the admin queue.

## External services and secrets

- SMS lives behind `lib/sms.ts`. With `SMS_PROVIDER=console` (dev), OTP codes are logged to the server console; `arkesel` is for production.
- Email goes through Resend (`lib/email.ts`). In dev without `RESEND_API_KEY`, verification links are logged to the console.
- All env vars are documented in `.env.example`. **Never commit `.env` or real secrets.**

## Conventions

- Tailwind utility classes only; no CSS modules or styled-components.
- Responsive and mobile-first; layouts must match both the 390px and 1512px Figma frames.
- Use accessible markup: labelled inputs, alt text on images, and keyboard-operable star input.
- Keep components small and colocate page-only components under their route.

## Before pushing

1. `npm run lint`, `npm test` and `npm run build` must all pass.
2. For UI changes, screenshot the page at 1512px and 390px with Playwright and compare it against the matching Figma frame.
3. For changes touching auth, reviews or businesses, re-check the trust and safety rules above.
