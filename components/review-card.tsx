import { Stars } from "@/components/stars";
import { ReportReview } from "@/components/report-review";
import { VerifiedBadge } from "@/components/verified-badge";
import { displayName, formatDate } from "@/lib/format";

type Props = {
  review: { id: string; rating: number; title: string; body: string; createdAt: Date; user: { name: string | null } };
  canReport: boolean;
  isMine: boolean;
};

/** Review card anatomy: name + verified badge, date, coral stars + numeral, the review, report link. */
export function ReviewCard({ review: r, canReport, isMine }: Props) {
  return (
    <article className={`rounded-2xl border bg-paper p-5 sm:p-6 ${isMine ? "border-ink" : "border-line"}`}>
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
          {displayName(r.user.name)}
          {isMine && <span className="text-sm font-normal text-muted">(you)</span>}
          <VerifiedBadge />
        </p>
        <time dateTime={r.createdAt.toISOString()} className="text-sm text-muted">{formatDate(r.createdAt)}</time>
      </header>
      <p className="mt-2 flex items-center gap-2">
        <Stars rating={r.rating} size={18} />
        <span className="font-display text-[15px] font-bold text-ink">{r.rating.toFixed(1)}</span>
      </p>
      <h3 className="mt-3 font-display text-lg font-bold">{r.title}</h3>
      <p className="mt-1.5 whitespace-pre-line text-body">{r.body}</p>
      {canReport && <ReportReview reviewId={r.id} />}
    </article>
  );
}
