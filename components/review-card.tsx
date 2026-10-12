import { Avatar } from "@/components/avatar";
import { Stars } from "@/components/stars";
import { ReportReview } from "@/components/report-review";
import { VerifiedBadge } from "@/components/verified-badge";
import { displayName, formatDate } from "@/lib/format";

type Props = {
  review: { id: string; rating: number; title: string; body: string; createdAt: Date; user: { name: string | null } };
  canReport: boolean;
  isMine: boolean;
};

/** Review card anatomy: initials avatar, name + verified badge, date, coral stars, the review, report link. */
export function ReviewCard({ review: r, canReport, isMine }: Props) {
  const name = displayName(r.user.name);
  return (
    <article className={`rounded-xl border bg-paper p-5 sm:p-6 ${isMine ? "border-ink" : "border-line"}`}>
      <header className="flex items-center gap-3">
        <Avatar name={name} size="lg" />
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-ink">
            {name}
            {isMine && <span className="text-sm font-normal text-muted">(you)</span>}
            <VerifiedBadge />
          </p>
          <time dateTime={r.createdAt.toISOString()} className="text-sm text-muted">{formatDate(r.createdAt)}</time>
        </div>
      </header>
      <p className="mt-4 flex items-center gap-2">
        <Stars rating={r.rating} size={18} />
        <span className="text-[15px] font-semibold text-ink">{r.rating.toFixed(1)}</span>
      </p>
      <h3 className="mt-3 text-lg font-bold">{r.title}</h3>
      <p className="mt-1 whitespace-pre-line text-body">{r.body}</p>
      {canReport && <ReportReview reviewId={r.id} />}
    </article>
  );
}
