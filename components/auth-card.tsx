import Link from "next/link";
import { BadgeCheckIcon, CheckIcon, LogoMark, ShieldCheckIcon, SmartphoneIcon } from "@/components/icons";

const POINTS = [
  { icon: SmartphoneIcon, text: "Every reviewer proves they're a real person" },
  { icon: BadgeCheckIcon, text: "One review per person, per business" },
  { icon: ShieldCheckIcon, text: "Reported reviews get checked" },
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
      <aside className="hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <Link href="/" className="inline-flex items-center gap-2.5 self-start">
          <LogoMark className="text-white" bg="#16161a" />
          <span className="font-display text-xl font-bold">RatingsGhana</span>
        </Link>
        <div className="my-auto max-w-md">
          <p className="font-display text-5xl leading-[1.05] font-bold">
            Real people.
            <br />
            Real opinions.
            <br />
            <span className="text-coral">No filters.</span>
          </p>
          <ul className="mt-10 space-y-4">
            {POINTS.map(({ icon: Icon, text }, i) => (
              <li key={text} className="flex animate-rise items-center gap-3 text-lg text-white/85" style={{ animationDelay: `${150 + i * 90}ms` }}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand">
                  <Icon size={20} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="flex items-center gap-2 text-sm text-white/60">
          <CheckIcon size={16} /> Free to use
        </p>
      </aside>

      <main className="flex flex-col bg-brand-wash px-4 py-8 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2.5 self-start text-ink lg:hidden">
          <LogoMark bg="#f6f5fa" />
          <span className="font-display text-lg font-bold text-ink">RatingsGhana</span>
        </Link>
        <div className="my-auto w-full max-w-md self-center py-10">
          <div className="animate-rise rounded-3xl border border-line bg-paper p-6 sm:p-9">
            <h1 className="font-display text-[2rem] leading-tight font-bold tracking-tight">{title}</h1>
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
  "flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-ink bg-paper px-4 text-base font-semibold text-ink transition-colors duration-200 hover:bg-brand-wash active:translate-y-px";

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
      className={`mb-5 animate-rise rounded-xl px-4 py-3 text-sm font-medium ${ok ? "bg-cta-soft text-ok-ink" : "border-l-4 border-coral bg-coral-soft text-ink"}`}
    >
      {children}
    </p>
  );
}
