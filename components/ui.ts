// Shared Tailwind class recipes so every page uses identical controls.

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

export const btn = {
  /** Main call to action (green). */
  cta: `${base} h-12 bg-cta px-6 text-white hover:bg-cta-hover`,
  /** Brand action (purple). */
  primary: `${base} h-12 bg-brand px-6 text-white hover:bg-brand-hover`,
  /** Secondary, outlined. */
  outline: `${base} h-12 border-2 border-line-strong bg-white px-6 text-ink hover:border-brand hover:text-brand`,
  /** Outlined, for use on purple/dark backgrounds. */
  outlineOnDark: `${base} h-12 border-2 border-white/50 px-6 text-white hover:border-white hover:bg-white/10`,
  /** Small variants for dense UI. */
  smPrimary: `${base} h-10 bg-brand px-4 text-sm text-white hover:bg-brand-hover`,
  smOutline: `${base} h-10 border border-line-strong bg-white px-4 text-sm text-ink hover:border-brand hover:text-brand`,
  smDanger: `${base} h-10 bg-red-700 px-4 text-sm text-white hover:bg-red-800`,
};

export const input =
  "h-12 w-full rounded-xl border border-line-strong bg-white px-4 text-base text-ink outline-none transition-colors duration-200 placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/15";

export const textarea =
  "w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-base text-ink outline-none transition-colors duration-200 placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/15";

export const label = "mb-1.5 block text-sm font-semibold text-ink";

export const card = "rounded-2xl border border-line bg-white";

export const container = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export const chip = (active: boolean) =>
  `inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
    active ? "border-brand bg-brand text-white" : "border-line-strong bg-white text-ink hover:border-brand hover:text-brand"
  }`;
