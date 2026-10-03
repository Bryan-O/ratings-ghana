"use client";

import { useActionState } from "react";
import { reportReviewAction } from "@/lib/actions/reviews";
import { initialState } from "@/lib/actions/state";
import { REPORT_REASONS } from "@/lib/constants";

export function ReportReview({ reviewId }: { reviewId: string }) {
  const [state, action, pending] = useActionState(reportReviewAction, initialState);

  if (state.ok) return <p className="mt-3 text-xs text-muted">{state.message}</p>;

  return (
    <details className="mt-3 text-xs">
      <summary className="cursor-pointer text-muted hover:text-ink">Report</summary>
      <form action={action} className="mt-2 flex flex-col gap-2">
        <input type="hidden" name="reviewId" value={reviewId} />
        <label className="sr-only" htmlFor={`reason-${reviewId}`}>Reason</label>
        <select id={`reason-${reviewId}`} name="reason" className="rounded-[4px] border border-[#d9d9d9] p-1.5" defaultValue={REPORT_REASONS[0]}>
          {REPORT_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <button type="submit" disabled={pending} className="self-start rounded-[4px] bg-btn px-3 py-1.5 font-semibold text-white disabled:opacity-60">
          {pending ? "Sending…" : "Send report"}
        </button>
        {state.errors?.form && <p className="text-red-700">{state.errors.form}</p>}
      </form>
    </details>
  );
}
