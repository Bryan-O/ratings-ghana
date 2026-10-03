"use client";

import { reportReviewAction } from "@/lib/actions/reviews";
import { REPORT_REASONS } from "@/lib/constants";
import { FlagIcon } from "@/components/icons";
import { btn } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";


export function ReportReview({ reviewId }: { reviewId: string }) {
  const [state, onSubmit, pending] = useFormAction(reportReviewAction);

  if (state.ok) return <p className="mt-4 text-sm text-muted">{state.message}</p>;

  return (
    <details className="group mt-4 text-sm">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg py-1 font-medium text-muted transition-colors duration-200 hover:text-red-700">
        <FlagIcon size={14} /> Report
      </summary>
      <form onSubmit={onSubmit} className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-brand-wash p-3">
        <input type="hidden" name="reviewId" value={reviewId} />
        <label className="sr-only" htmlFor={`reason-${reviewId}`}>Reason</label>
        <select id={`reason-${reviewId}`} name="reason" defaultValue={REPORT_REASONS[0]} className="h-10 cursor-pointer rounded-lg border border-line-strong bg-white px-3 text-ink">
          {REPORT_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <button type="submit" disabled={pending} className={btn.smDanger}>
          {pending ? "Sending…" : "Send report"}
        </button>
        {state.errors?.form && <p className="w-full text-red-700">{state.errors.form}</p>}
      </form>
    </details>
  );
}
