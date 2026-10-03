import Link from "next/link";
import { BadgeCheckIcon, CheckIcon, LogoMark, ShieldCheckIcon, SmartphoneIcon } from "@/components/icons";

const POINTS = [
  { icon: SmartphoneIcon, text: "Every reviewer verifies a Ghana phone number" },
  { icon: BadgeCheckIcon, text: "One review per person, per business" },
  { icon: ShieldCheckIcon, text: "Suspicious reviews are reported and moderated" },
];

/** Split auth layout: brand panel (desktop) + form card. */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand via-brand-hover to-brand-night p-12 text-white lg:flex lg:flex-col">
        <span aria-hidden className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10" />
        <span aria-hidden className="absolute bottom-10 -left-20 size-64 rounded-full bg-brand-light/20" />
        <Link href="/" className="relative inline-flex items-center gap-2.5">
          <LogoMark className="text-white [&>rect]:fill-white/15" />
          <span className="font-display text-xl font-bold">RatingsGhana</span>
        </Link>
        <div className="relative my-auto max-w-md">
          <p className="font-display text-4xl leading-tight font-bold">Reviews you can actually trust.</p>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-lg text-white/90">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <Icon size={20} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative flex items-center gap-2 text-sm text-white/70">
          <CheckIcon size={16} /> Free for everyone in Ghana
        </p>
      </aside>

      <main className="flex flex-col bg-brand-wash px-4 py-8 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2.5 text-brand lg:hidden">
          <LogoMark />
          <span className="font-display text-lg font-bold text-ink">RatingsGhana</span>
        </Link>
        <div className="my-auto w-full max-w-md self-center py-10">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_20px_50px_-20px_rgba(76,29,149,0.25)] sm:p-9">
            <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <div className="mt-1.5 text-muted">{subtitle}</div>}
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mt-6 text-center text-[15px] text-muted">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export function Terms() {
  return (
    <p className="mt-6 text-center text-xs leading-relaxed text-muted">
      By continuing, you agree to RatingsGhana&apos;s <span className="font-semibold text-ink">Terms of Service</span> and acknowledge
      RatingsGhana&apos;s <span className="font-semibold text-ink">Privacy Policy</span>.
    </p>
  );
}

export const socialBtn =
  "flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-line-strong bg-white px-4 text-base font-semibold text-ink transition-colors duration-200 hover:border-brand hover:text-brand";

export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-4 text-sm font-medium text-muted" role="separator">
      <span className="h-px flex-1 bg-line-strong" />
      or
      <span className="h-px flex-1 bg-line-strong" />
    </div>
  );
}

export function Notice({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p
      role="status"
      className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${ok ? "border-green-200 bg-cta-soft text-green-900" : "border-red-200 bg-red-50 text-red-800"}`}
    >
      {children}
    </p>
  );
}
