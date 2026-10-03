import { Stars } from "@/components/stars";
import { ReportReview } from "@/components/report-review";

type Props = {
  review: { id: string; rating: number; title: string; body: string; createdAt: Date; user: { name: string | null } };
  canReport: boolean;
  isMine: boolean;
};

/** Displayed as "First name" only, to protect reviewer privacy. */
function displayName(name: string | null) {
  return name?.trim().split(/\s+/)[0] || "Verified reviewer";
}

/** Figma "Review Ticker" card. */
export function ReviewCard({ review: r, canReport, isMine }: Props) {
  const date = r.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Accra" });
  return (
    <article className="rounded-[12px] border border-[#d9d9d9] bg-white p-4">
      <header className="flex items-start justify-between gap-3 text-xs">
        <p className="font-semibold text-ink">
          {displayName(r.user.name)}
          {isMine && <span className="ml-1.5 font-normal text-muted">(you)</span>}
        </p>
        <time dateTime={r.createdAt.toISOString()} className="shrink-0 text-muted">{date}</time>
      </header>
      <Stars rating={r.rating} size={20} className="mt-2" />
      <h3 className="mt-2 text-sm font-semibold text-ink">{r.title}</h3>
      <p className="mt-1.5 text-sm leading-snug whitespace-pre-line text-ink">{r.body}</p>
      {canReport && <ReportReview reviewId={r.id} />}
    </article>
  );
}
