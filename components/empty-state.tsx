import { LogoMark } from "@/components/icons";

/** Empty states: one simple speech-bubble motif plus one useful line (and an optional action). */
export function EmptyState({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-brand-wash px-6 py-12 text-center">
      <LogoMark size={48} className="animate-pop text-ink" bg="#f6f5fa" />
      <p className="mt-4 font-display text-xl font-bold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-md text-muted">{text}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
