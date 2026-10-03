import { BadgeCheckIcon } from "@/components/icons";
import { Stars } from "@/components/stars";
import { ReportReview } from "@/components/report-review";
import { displayName, formatDate, initials } from "@/lib/format";

type Props = {
  review: { id: string; rating: number; title: string; body: string; createdAt: Date; user: { name: string | null } };
  canReport: boolean;
  isMine: boolean;
};

export function ReviewCard({ review: r, canReport, isMine }: Props) {
  return (
    <article className={`rounded-2xl border bg-white p-5 sm:p-6 ${isMine ? "border-brand-light ring-2 ring-brand-soft" : "border-line"}`}>
      <header className="flex items-start gap-3">
        <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand font-display text-lg font-bold text-white">
          {initials(r.user.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 font-semibold text-ink">
            {displayName(r.user.name)}
            {isMine && <span className="text-sm font-normal text-muted">(you)</span>}
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-cta">
              <BadgeCheckIcon size={14} /> Verified
            </span>
          </p>
          <time dateTime={r.createdAt.toISOString()} className="text-sm text-muted">{formatDate(r.createdAt)}</time>
        </div>
        <Stars rating={r.rating} size={18} className="shrink-0" />
      </header>
      <h3 className="mt-4 font-display text-lg font-semibold">{r.title}</h3>
      <p className="mt-1.5 whitespace-pre-line text-body">{r.body}</p>
      {canReport && <ReportReview reviewId={r.id} />}
    </article>
  );
}
