# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

@AGENTS.md — this is Next.js 16. Read the bundled docs in `node_modules/next/dist/docs/` before using a Next API you're unsure of (e.g. `proxy.ts` replaced `middleware.ts`, and `params`/`searchParams` are Promises).

## Project

**RatingsGhana** is a platform where people in Ghana star-rate (1–5) and review businesses, both physical shops and online sellers, and the customer service they give.

The product's core value is **trustworthy reviews**. Anti-fake-review measures are product-critical, not optional. Treat any change that weakens them as a bug.

MVP scope:
- real, verified user accounts;
- an inventory of Ghanaian businesses (seeded, plus user-suggested listings approved by an admin);
- search;
- star ratings and written reviews.

## Design system ("Loud & Clear")

The brand follows the **Loud & Clear** guidelines: "Real people. Real opinions. No filters." `docs/brand.md` summarises them (colour, type, logo, ratings, components, voice/copy library, motion). **They, not the Figma file, are the visual source of truth.**

- **Tokens** are defined in `app/globals.css` (`@theme`). Use the token classes (`bg-ink`, `bg-paper`, `bg-coral`, `text-brand`, `bg-brand-wash`, `text-star` …), never raw hex values. Old token names were kept and remapped:
  - ink `#16161A` (`ink`, `cta`, `brand-night`): text, logo, primary buttons, dark sections;
  - paper `#FFFFFF` (`paper`): page and cards; light neutral `#F6F5FA` (`brand-wash`) for containers;
  - signal coral `#FF4D5E` (`coral`, `star`, `cta-hover`): CTA hover/press, earned stars, highlights. **Never body text** (3.2:1); error text uses `coral-ink` `#C42338`;
  - deep violet `#3D2C8D` (`brand`): verified badges, links, navigation, focus rings;
  - stars are solid coral when earned and ink outlines at 40% when not. **Never yellow or gold stars.**
- **Type:** Space Grotesk Bold for headings and rating numerals (`font-display font-bold`), Inter for everything else (`font-sans`), via `next/font/google` in `app/layout.tsx`. Use sentence case; no all-caps headlines.
- **Shared recipes** live in `components/ui.ts` (`btn.*`, `input`, `textarea`, `label`, `card`, `panel`, `lift`, `eyebrow`, `container`, `chip`). Primary buttons are ink and shift to coral with an ink label on hover/press. Reuse the recipes instead of re-styling controls.
- **Brand components:**
  - `LogoMark`: a speech bubble with a coral star. Never rotate or recolour it. Use `mono` on dark backgrounds, and pass `bg`.
  - `VerifiedBadge`: a violet pill with the fixed wording "Verified reviewer".
  - `EmptyState`: a bubble motif plus one line.
  - `Stars` / `RatingBadge`.
- **Icons** are Lucide-style inline SVGs in `components/icons.tsx` (24×24, 2px stroke). Never use emoji as icons.
- **Layout:** sticky paper top bar (`SiteHeader`, with an optional neutral title band via the `title`/`crumbs`/`subtitle`/children props), ink `SiteFooter`, and the split-screen `AuthCard` (ink panel). Content width is `max-w-7xl`. One clear action per surface.
- **Interaction:** the platform is meant to feel responsive. Every effect answers a user action. Examples: star pop, confirmation rise/pop, card lift, search suggestions, hero review ticker, rating bars on view, photo lightbox, and the nav progress line (`NavProgress`). Animate transform and opacity only, 150–700ms.
- **Rules:**
  - `cursor-pointer` and a 200ms colour transition on everything interactive;
  - no drop shadows or gradients, and no scale-on-hover layout shift;
  - visible focus rings and touch targets of at least 44px;
  - `prefers-reduced-motion` is respected in `globals.css` (everything static);
  - no horizontal scroll at 375px.
- **Copy:** use the brand voice and copy library in `docs/brand.md` (e.g. "How did it really go?", "Your review is live."). Privacy and moderation copy must be literal.
- **Placeholders:** businesses without photos show a flat brand-colour tile (`BusinessImage`) with the category icon and initials.
- **Base CSS:** keep global element styles inside `@layer base`. Unlayered CSS overrides Tailwind utilities.

Figma file `7369kBlLR6ZW71vrRPGJvq` ("RatingsGhana") is the original wireframe. Use it for page inventory and content, not visuals:

| Page | Route | Desktop frame | Mobile frame |
|---|---|---|---|
| Homepage | `/` | `2:2` | `225:284` |
| Businesses list | `/businesses` | `67:6` | `225:285` |
| Business details | `/businesses/[slug]` | `82:174` | `225:286` |
| Register | `/register` | `195:196` | `225:287`, email step `244:124` |
| Login | `/login` | `214:244` | `225:288` |

Never ship "Yelp" text (the wireframe copy contains it).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL (Neon in production, local Postgres 16 in development)
- Auth.js v5 (Google + email/password) with **JWT sessions and no adapter**: Google users are upserted by email in the `jwt` callback. Uses zod for validation and bcryptjs for passwords.
- Vitest (unit) and Playwright (e2e and visual checks; Chromium is preinstalled in cloud sessions, so never run `playwright install`)
- Deployed on Vercel

## Commands

```bash
npm run dev            # dev server (http://localhost:3000)
npm run lint           # ESLint
npm test               # Vitest unit tests (tests/)
npm run build          # prisma generate + next build (also type-checks)
npm run test:e2e       # Playwright e2e (e2e/), starts `next dev` on :3100
npm run db:migrate     # prisma migrate dev (run `npx prisma generate` after schema edits)
npm run db:seed        # businesses + admin; demo reviews when SEED_DEMO_DATA=true
```

- **Local Postgres in cloud sessions:**
  - start it with `service postgresql start`;
  - the DB is `ratings_ghana`, user/password `postgres`/`postgres`;
  - copy `.env.example` to `.env` and set `AUTH_SECRET`.
- **Playwright:** use the preinstalled Chromium by setting `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium`.
- **Dev outbox:** OTP codes and verification links land in `.dev-outbox.log`, which the e2e tests read.
- **Prisma 7:** the client is generated to `lib/generated/prisma` (gitignored) and must be imported from `@/lib/generated/prisma/client`. Config lives in `prisma.config.ts`, which also holds the seed command.
- **Photos:** community uploads go through `lib/actions/photos.ts`. They're stored by `lib/storage.ts` in `.uploads/` locally (served by `app/uploads/[...key]/route.ts`) and on Vercel Blob in production. Photos we have rights to can also go in `public/images/businesses/<slug>/`, which the seed picks up.
  - **Never copy photos from Google, Google Maps, social media or other websites.** They're copyrighted, and showing them would be infringement.

## Architecture

```
app/                 routes (server components by default)
components/          shared UI (SiteHeader, BusinessCard, StarRating, ReviewCard, ...)
lib/
  db.ts              Prisma client singleton
  auth.ts            Auth.js config
  session.ts         getCurrentUser() (fresh DB read) + nextVerificationStep()
  queries.ts         read-side queries (search, business, reviews)
  ratings-db.ts      recomputeBusinessRating(tx, id), used inside review-write transactions
  otp.ts             OTP generation/HMAC/expiry rules
  phone.ts           Ghana phone normalisation/validation (E.164 +233)
  sms.ts             SMS provider adapter (console | arkesel)
  storage.ts         photo storage adapter (local | vercel-blob)
  images.ts          upload validation (magic bytes) + sharp re-encode to WebP, strips EXIF/GPS
  email.ts           email sending (Resend)
  validation.ts      zod schemas
  duplicates.ts      duplicate-listing detection (name tokens, website/social handle keys)
  business-slug.ts   uniqueSlug() for business URLs
  use-form-action.ts client hook all forms submit through (no auto-reset, recovery messages)
  actions/           server actions — ALL mutations live here (auth, phone, reviews, businesses, photos, admin)
tests/               Vitest unit tests
e2e/                 Playwright end-to-end tests
prisma/
  schema.prisma
  seed.ts
```

- All writes go through **server actions in `lib/actions/*`**, validated with zod. There is no DB access from client components.
- **Forms:**
  - client forms submit with `useFormAction(action)` from `lib/use-form-action.ts` (`<form onSubmit={onSubmit}>` plus `<SubmitButton pending={pending}>`), **not** `<form action={...}>` with `useActionState`;
  - reason: React auto-resets `<form action>` forms after each submit, snapping selects and radios back to their initial values while the UI still shows the user's choice, which silently submits the wrong data;
  - the hook also wraps actions with `withRecovery` (`lib/actions/safe-action.ts`), so a stale deployment ("Server Action not found") or a network failure shows a message with a Reload button instead of failing silently.
- Form server actions are wrapped in `guard()` (`lib/actions/guard.ts`), which logs unexpected errors and returns a visible form error.
- **Admin moderation** (`/admin`, `app/admin/*`):
  - `getModerationQueue()` in `lib/queries.ts` returns pending listings with the submitter's track record and likely duplicates;
  - duplicates come from `lib/duplicates.ts`, which matches identifying name words and the same website or social handle;
  - admins can edit a pending listing (`BusinessEditor` → `updatePendingBusinessAction`, which regenerates the slug if the name or city changes) and then "Save & approve".
- **Tester feedback:**
  - `components/feedback-widget.tsx` (floating button + native `<dialog>`, mounted in `app/layout.tsx`) submits to `submitFeedbackAction` (`lib/actions/feedback.ts`);
  - anonymous submissions are allowed and rate-limited (10/hour per salted IP hash or user), with a honeypot field;
  - admins use `/admin/feedback` (filter, resolve) and `/admin/feedback/export` (CSV with formula-injection-safe cells);
  - set `FEEDBACK_ENABLED=false` to hide the button.
- Use server components by default. Add `"use client"` only for interactive pieces (star input, forms, mobile menu).

## Trust and safety rules (must not regress)

1. Creating or editing a review requires a session, a **verified email** and a **verified phone**, all checked **server-side** in the action rather than only in the UI.
2. Phone numbers are **unique per account**, stored as E.164 (`+233…`). OTP codes are **hashed**, expire after 10 minutes, allow max 5 attempts per code and max 5 sends per hour per user.
3. **One review per user per business**, enforced by a unique DB constraint; users edit rather than duplicate.
4. `Business.avgRating` / `reviewCount` are recomputed **in the same transaction** as any review write.
5. User-suggested businesses are `PENDING` and invisible to the public until an admin approves them.
   - Only `PENDING` listings can be approved, rejected or edited (`lib/actions/admin.ts`).
   - Rejection requires a reason from `REJECTION_REASONS` (plus an optional note), stored in `Business.rejectionReason` and shown to the submitter on `/my-submissions`.
6. Admin pages and actions check `role === "ADMIN"` **server-side**.
7. Reviews per user are rate-limited, and reviews can be reported into the admin queue.
8. **Photo uploads:**
   - they require a fully verified user and an approved business, plus the uploader's confirmation that they took the photo or have permission to share it;
   - they are rate-limited to 20 a day;
   - they're validated by magic bytes and re-encoded with sharp, which strips EXIF/GPS metadata;
   - they start `PENDING` and only reach `Business.images` when an admin approves them, in the same transaction;
   - rejecting or removing a photo pulls it from `Business.images` and deletes the stored file.

## External services and secrets

- SMS lives behind `lib/sms.ts`. With `SMS_PROVIDER=console` (dev), OTP codes are logged to the server console; `arkesel` is for production.
- Email goes through Resend (`lib/email.ts`). In dev without `RESEND_API_KEY`, verification links are logged to the console. In production both fallbacks throw instead of silently skipping verification.
- Demo reviews (`SEED_DEMO_DATA=true`) are for local dev only. Never seed invented reviews into production.
- All env vars are documented in `.env.example`. **Never commit `.env` or real secrets.**

## Conventions

- Tailwind utility classes only; no CSS modules or styled-components.
- Responsive and mobile-first; check 390px and 1440px.
- Use accessible markup: labelled inputs, alt text on images, and keyboard-operable star input.
- Keep components small and colocate page-only components under their route.

## Before pushing

1. `npm run lint`, `npm test` and `npm run build` must all pass.
2. For UI changes, screenshot the page at 1440px and 390px with Playwright. Check it against the design system above, including that there's no horizontal overflow.
3. For changes touching auth, reviews or businesses, re-check the trust and safety rules above.
