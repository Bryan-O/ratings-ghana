// Shared Tailwind class recipes so every page uses identical controls ("Loud & Clear", docs/brand.md).

/**
 * Shared press/hover motion for anything clickable that looks like a button:
 * hover (mouse) or keyboard focus lifts it 2px with a growing soft shadow; pressing (mouse or touch)
 * scales it to 0.96 at once and springs back on release. Disabled controls don't move.
 */
export const press =
  "transition-[translate,scale,box-shadow,background-color,border-color,color] duration-200 ease-spring active:duration-75 not-disabled:hover:-translate-y-0.5 not-disabled:hover:shadow-[0_10px_22px_-10px_rgb(22_22_26/0.45)] not-disabled:focus-visible:-translate-y-0.5 not-disabled:focus-visible:shadow-[0_10px_22px_-10px_rgb(22_22_26/0.45)] not-disabled:active:translate-y-0 not-disabled:active:scale-[0.96] not-disabled:active:shadow-[0_3px_8px_-4px_rgb(22_22_26/0.4)]";

const base = `relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold ${press} disabled:cursor-not-allowed disabled:opacity-60`;

// Primary: ink fill, paper text; on hover or press the fill shifts to coral and the label to ink.
// Primary actions also get the tap colour-wash (`ripple`, run by MotionRuntime).
const primaryFill =
  "ripple overflow-hidden bg-cta text-white hover:bg-cta-hover hover:text-ink active:bg-cta-hover active:text-ink";

export const btn = {
  /** The one main action on a surface. */
  cta: `${base} h-12 px-6 ${primaryFill}`,
  /** Same as cta; kept so older call sites read naturally. */
  primary: `${base} h-12 px-6 ${primaryFill}`,
  /** Coral action for ink or violet surfaces, where an ink button would disappear. */
  coral: `${base} ripple overflow-hidden h-12 bg-coral px-6 text-ink hover:bg-white`,
  /** Secondary: paper fill with an ink outline. Never for the main path. */
  outline: `${base} h-12 border-2 border-ink bg-paper px-6 text-ink hover:bg-ink hover:text-white`,
  /** Outlined, for use on ink/violet backgrounds. */
  outlineOnDark: `${base} h-12 border-2 border-white px-6 text-white hover:bg-white hover:text-ink`,
  /** Small variants for dense UI. */
  smPrimary: `${base} h-10 px-4 text-sm ${primaryFill}`,
  smOutline: `${base} h-10 border-2 border-ink bg-paper px-4 text-sm text-ink hover:bg-ink hover:text-white`,
  smDanger: `${base} h-10 bg-coral-ink px-4 text-sm text-white hover:bg-ink`,
};

// The shake on error is triggered by FieldError (lib/motion.ts `shake`), so it replays on every failed submit.
const invalid = "aria-[invalid=true]:border-coral-ink aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-coral/20";

// Form field: paper fill, 1px ink at 30%, 12px radius; focus adds a violet ring without removing the border.
const field =
  "w-full rounded-xl border border-line-strong bg-paper text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted hover:border-ink/60 focus:border-brand focus:ring-4 focus:ring-brand/20";

export const input = `h-12 px-4 ${field} ${invalid}`;

export const textarea = `px-4 py-3 ${field} ${invalid}`;

export const label = "mb-1.5 block text-sm font-semibold text-ink";

/** A white card with a hairline border. */
export const card = "rounded-2xl border border-line bg-paper";

/** Light neutral container on paper (business rating cards, panels). */
export const panel = "rounded-2xl bg-brand-wash";

/** Hover response for clickable cards: flat (no shadows), a small lift and an ink edge. */
export const lift =
  "transition-[translate,box-shadow,border-color,background-color] duration-300 ease-spring hover:-translate-y-1 hover:border-ink hover:shadow-[0_18px_36px_-18px_rgb(22_22_26/0.4)] focus-visible:-translate-y-1 focus-visible:shadow-[0_18px_36px_-18px_rgb(22_22_26/0.4)] active:translate-y-0 active:duration-100";

export const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/** Small all-caps label used above groups, as in the brand book (never for headlines). */
export const eyebrow = "text-xs font-semibold tracking-[0.08em] text-muted uppercase";

export const chip = (active: boolean) =>
  `inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap ${press} ${
    active ? "border-ink bg-ink text-white" : "border-line-strong bg-paper text-ink hover:border-ink"
  }`;
