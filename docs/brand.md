# Brand: Loud & Clear

The source is the "Loud & Clear" brand guidelines PDF (v1.0, October 2026). This file summarises how the app implements it. When they disagree, the PDF wins.

**Proposition:** Real people. Real opinions. No filters.

**Personality:** direct, honest, energetic, fair.

The identity is name-independent: no national colours, flags, map shapes or cultural motifs.

## Colour

Paper and ink do the heavy lifting. Coral prompts action and marks earned stars. Violet marks trust and navigation. The target split is 70% paper, 20% ink, 10% coral + violet.

| Role | Hex | Token (Tailwind) | Use |
|---|---|---|---|
| Ink | `#16161A` | `ink`, `cta`, `brand-night` | Primary text, logo, headers, primary buttons, dark sections |
| Paper | `#FFFFFF` | `paper` | Page background, cards, reverse text |
| Signal coral | `#FF4D5E` | `coral`, `star`, `cta-hover` | CTA hover/press, earned stars, highlights, large text only |
| Deep violet | `#3D2C8D` | `brand` | Verified badges, links, navigation, focus rings, data |
| Light neutral | `#F6F5FA` | `brand-wash` | Containers on paper (rating cards, panels) |
| Violet tint | `#ECE9F7` | `brand-soft` | Category chips, info notes |
| Coral tints | `#FFF0F1` / `#FFE3E6` | `coral-soft` / `coral-tint` | Callouts (with a coral left edge), rating-input tiles |
| Coral ink | `#C42338` | `coral-ink` | Error text (passes AA) |
| Success | `#ECF6EF` / `#1E6B3A` | `cta-soft` / `ok-ink` | Confirmations ("Your review is live.") |

Accessibility rules:
- Coral on white is about 3.2:1, so never use it for body copy. It's fine for large text, icons and stars.
- Body text is ink on paper.
- Violet on white (10.8:1) is fine for links and UI chrome.

## Type

- **Manrope** for everything. The owner asked to match Trustpilot's type, which is proprietary; Manrope is the closest free match. One variable font, loaded with `next/font/google`.
  - **Extra-bold (800)** (`font-display font-extrabold`): the hero, page titles and rating numerals. Hero 52/57, page title 40/44.
  - **Bold (700):** section headlines (26/32) and card titles (16/22).
  - **Regular, medium, semibold** (`font-sans`): body 16/24, small 14/20, caption 12/16. Use regular for reading, medium for controls and semibold for labels.
  - **Spacing:** keep headings between 0 and -0.02em tracking.
- Use sentence case and never all-caps headlines. Small all-caps labels (`eyebrow`) are allowed above groups.
- Numbers use tabular figures (set globally).

## Logo

The mark is a bold speech bubble whose corner resolves into a coral star (`LogoMark` in `components/icons.tsx`).
- Use it in two colours (ink + coral) on light backgrounds.
- On ink or violet backgrounds, use the `mono` variant in white.
- Never tilt, recolour, add shadows or gradients, or place it on busy photos.
- Pass `bg` (the surface colour) so the star is cut cleanly out of the bubble.

## Ratings

- Use one sharp, geometric five-pointed star everywhere.
- Earned stars are solid coral; unearned stars are ink outlines at 40%.
- **Never yellow or gold.**
- Set the rating numeral in Manrope right beside the row (semibold on cards, extra-bold in the score card).
- The score card adds a plain word under the numeral: Excellent (4.5+), Good (3.5+), Okay (2.5+), Poor (1.5+), Bad.

## Components

| Component | Spec | Code |
|---|---|---|
| Primary button | Ink pill, paper text. On hover or press the fill shifts to coral and the label to ink. | `btn.cta` / `btn.primary` |
| Secondary button | Paper pill with a 1px violet outline ("Visit website", "Share"), or a 2px ink outline. Never for the main path. | `btn.pill` / `btn.outline` |
| Coral button | For ink or violet surfaces. | `btn.coral` |
| Verified badge | Violet pill, white check, the fixed wording "Verified reviewer". | `<VerifiedBadge>` |
| Rating input | Five large tappable stars on light coral tiles, filling coral left to right. | `components/review-form.tsx` |
| Form field | Paper, 1px ink at ~30%, 12px radius, violet focus ring that keeps the border. | `input`, `textarea` |
| Business card | White with a hairline border: logo-style thumbnail, bold name, where it is, coral stars + "4.7 (15)". | `BusinessCard` |
| Search | Pill with business and location fields and a round ink button. | `SearchBar` |
| Empty state | One speech-bubble motif plus one useful line. | `<EmptyState>` |

**Rule of thumb:** one clear action per surface.

## Voice

Write like a straight-talking friend: short sentences, plain words, direct actions, honest limits. Keep it warm without hype.

Don't use "leverage", "synergy", "delve", "cutting-edge", "revolutionize", "world-class", "game-changing", "seamless" or "best-in-class".

Copy library, used in the app:

| Moment | Copy |
|---|---|
| Review prompt | How did it really go? Rate the business and tell people what mattered. |
| Empty business page | No reviews yet. You could be first. Share a real experience to help the next customer. |
| Review posted | Your review is live. Thanks for saying it clearly. |
| Phone verification | Prove you're a real person. We'll text you a code. |
| Reported review | Thanks. We're checking this review. It stays visible unless it breaks the community rules. |
| Business pending | Submitted. We're checking the details. We'll publish the business when the information is confirmed. |
| No search results | Nothing matched that search. Try a shorter name, a different spelling, or browse by category. |
| Error | That didn't work. Try again. If it keeps happening, come back in a few minutes. |

Privacy and moderation copy must be literal. Never promise something the product doesn't do.

## Layout

The arrangement follows Trustpilot's (structure and type only). Colours stay "Loud & Clear": Trustpilot's pastel bands become light neutral, coral and violet tints, and stars stay coral.

- **Top bar:** ink, with the mono logo, a compact search on inner pages, white links and one coral pill.
- **Home**, in order:
  - a centred hero on light neutral with flat coral and violet shapes;
  - a "Write a review" prompt on a divider line;
  - the category icon row;
  - a coral-soft promo band;
  - "Best in <category>" rows of four cards;
  - a violet-tint join band;
  - another "Best in" row;
  - a coral-tint "We're RatingsGhana" band with an inner ink card;
  - a "Recent reviews" grid;
  - the multi-column ink footer.
- **Business page:**
  - an ink breadcrumb band;
  - a white sheet with a 40px rounded top;
  - main column: name, score line, actions, photos, the review form, reviews, then "About" / "Contact info" with the heading on the left;
  - right column: the score card and trust notes.
- **Section headers:** the title on the left and a small violet "See more" pill on the right.
- **Widths:** content is 1200px wide. Card rows swipe on phones and tablets and become four-column grids on desktop.

## Motion

The guidelines don't define motion. This is the app's interpretation of "energetic: move with pace". It's implemented in `lib/motion.ts` and `app/globals.css`.

**Language:**
- every interactive element reacts within about 100ms;
- spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for playful elements;
- a smooth ease-out for larger reveals;
- 150–300ms for hover and press, 400–600ms for load and scroll reveals;
- transform and opacity only.

| Moment | Effect |
|---|---|
| Homepage load | The headline builds itself word by word (24px up, 70ms apart); the sub-headline, search and chips fade up after it |
| Headline hover or tap | The word lifts 2px and turns signal coral |
| Buttons | Lift 2px with a soft shadow on hover or focus; scale to 0.96 on press and spring back. Primary actions get a colour wash from the tap point |
| Star rating | Hover previews it with stars popping in one after another (scale 1.15); tapping locks it with a pop and a small coral and violet burst |
| Cards and lists | Fade and slide up 16px as they scroll into view, 60ms apart |
| Business card hover | Lifts 4px, shadow deepens, the name turns violet |
| Inputs | Border moves to violet with a soft ring fading in |
| Validation error | The field shakes once (4px, 300ms) and the message drops in |
| Filtering and sorting | Results re-reveal; the sort control shows a spinner while loading |
| Navigating | A thin coral progress line along the top; the nav underline tracks the current section |
| Phones | The header slides away while scrolling down; a "Rate it" bar slides up from the bottom |

Rules:
- `prefers-reduced-motion` turns every effect off: content renders in its final state and nothing starts hidden;
- nothing relies on hover alone;
- focus-visible states are at least as visible as hover states;
- animation never shifts layout;
- soft shadows appear only as interaction feedback, never as static decoration, and never on the logo.
