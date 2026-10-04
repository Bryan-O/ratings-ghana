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

- **Space Grotesk 700** (`font-display font-bold`): headlines, hero lines and rating numerals. Display 40/44, H1 32/36, H2 24/30, H3 20/26.
- **Inter** (`font-sans`): body 16/24, small 14/20, caption 12/16. Use Regular for reading, Medium for controls and SemiBold for labels.
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
- Set the rating numeral in Space Grotesk Bold right beside the row.

## Components

| Component | Spec | Code |
|---|---|---|
| Primary button | Ink fill, paper text, 12px radius. On hover or press the fill shifts to coral and the label to ink. | `btn.cta` / `btn.primary` |
| Secondary button | Paper with a 2px ink outline. Never for the main path. | `btn.outline` |
| Coral button | For ink or violet surfaces. | `btn.coral` |
| Verified badge | Violet pill, white check, the fixed wording "Verified reviewer". | `<VerifiedBadge>` |
| Rating input | Five large tappable stars on light coral tiles, filling coral left to right. | `components/review-form.tsx` |
| Form field | Paper, 1px ink at ~30%, 12px radius, violet focus ring that keeps the border. | `input`, `textarea` |
| Business rating card | Light neutral container, name in Space Grotesk Bold, coral stars + numeral. | `BusinessCard` |
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

## Motion

The guidelines don't define motion. This is the app's interpretation of "energetic: move with pace".

| Moment | Effect |
|---|---|
| Picking a star | The filled stars pop in left to right |
| Posting, sending, submitting | The confirmation rises in with a check that pops |
| Verified badge | The check draws itself in |
| Clickable cards | Lift 2px with an ink edge (no shadows, no scale) |
| Search | Category suggestions drop down (arrow keys, Enter, Escape) |
| Hero | Recent verified reviews cycle (pauses on hover or focus) |
| Rating breakdown | Bars fill when scrolled into view |
| Business photos | Open in a lightbox (arrow keys, Esc) |
| Navigating | A thin coral progress line along the top; the nav underline tracks the current section |
| Filtering reviews | Tap a rating bar or star chip; the list re-rises, filtered, with a "Show more" button |
| Sorting | The business list re-orders in place (spinner while loading) |
| Writing a review | A length guide fills coral to the 30-character minimum, then turns green |
| Sharing | Opens the phone's share sheet, or copies the link and confirms "Link copied" |
| Scrolling on phones | The header slides away going down and returns going up; a "Rate it" bar slides up from the bottom |
| Swipe rows | Cards and filters snap as you swipe; arrow buttons appear on wider screens when a row overflows |
| Invalid field | Shakes once |

Rules:
- 150–700ms;
- transform and opacity only;
- everything is static under `prefers-reduced-motion`.
