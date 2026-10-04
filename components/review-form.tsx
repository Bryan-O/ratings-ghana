"use client";

import { useState } from "react";
import { submitReviewAction } from "@/lib/actions/reviews";
import { StarIcon } from "@/components/icons";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";
import { input, label, textarea } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";


const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];
// Matches reviewSchema in lib/validation.ts.
const MIN_BODY = 30;
const MAX_BODY = 3000;

type Props = {
  businessId: string;
  existing?: { rating: number; title: string; body: string };
};

export function ReviewForm({ businessId, existing }: Props) {
  const [state, onSubmit, pending] = useFormAction(submitReviewAction);
  const v = state.values;
  const [rating, setRating] = useState<number>(Number(v?.rating) || existing?.rating || 0);
  const [hover, setHover] = useState(0);
  const [punched, setPunched] = useState(0);
  const [bodyLength, setBodyLength] = useState((v?.body ?? existing?.body ?? "").trim().length);
  const needed = Math.max(0, MIN_BODY - bodyLength);
  const shown = hover || rating;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="businessId" value={businessId} />

      <fieldset onMouseLeave={() => setHover(0)}>
        <legend className={label}>Your rating</legend>
        {/* Five large tappable stars on light coral tiles; they fill coral from left to right. */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => {
            const on = n <= shown;
            return (
              <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => {
                    setRating(n);
                    setPunched((p) => p + 1);
                  }}
                  className="peer sr-only"
                  aria-label={`${n} star${n > 1 ? "s" : ""} — ${LABELS[n - 1]}`}
                />
                <span
                  className={`flex size-12 items-center justify-center rounded-xl transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${
                    on ? "bg-coral-tint" : "bg-coral-soft hover:bg-coral-tint"
                  }`}
                >
                  <span
                    // Re-key on each pick so the filled stars pop in again, one after another.
                    key={on && n <= rating ? `p${punched}` : "idle"}
                    className={on && n <= rating && punched > 0 ? "animate-pop" : ""}
                    style={{ animationDelay: `${(n - 1) * 45}ms` }}
                  >
                    <StarIcon size={28} filled={on} className={on ? "text-star" : "text-star-empty"} />
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-1.5 h-5 text-sm font-semibold text-ink" aria-live="polite">
          {shown ? (
            <>
              <span className="font-display">{shown}.0</span> · {LABELS[shown - 1]}
            </>
          ) : (
            <span className="font-normal text-muted">Tap a star</span>
          )}
        </p>
        <FieldError message={state.errors?.rating} />
      </fieldset>

      <div>
        <label htmlFor="review-title" className={label}>Title</label>
        <input id="review-title" name="title" maxLength={100} defaultValue={v?.title ?? existing?.title} placeholder="The one thing people should know" className={input} />
        <FieldError message={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="review-body" className={label}>Your review</label>
        <textarea
          id="review-body"
          name="body"
          rows={6}
          maxLength={MAX_BODY}
          defaultValue={v?.body ?? existing?.body}
          onChange={(e) => setBodyLength(e.target.value.trim().length)}
          aria-describedby="review-body-count"
          placeholder="Tell us what happened. How were you treated?"
          className={`${textarea} min-h-36 resize-y`}
        />
        {/* Live length guide: fills coral up to the minimum, then confirms. */}
        <div className="mt-2 flex items-center gap-3">
          <span aria-hidden className="h-1 flex-1 overflow-hidden rounded-full bg-brand-wash">
            <span
              className={`block h-full origin-left rounded-full transition-[transform,background-color] duration-300 ${needed ? "bg-coral" : "bg-ok-ink"}`}
              style={{ transform: `scaleX(${Math.min(1, bodyLength / MIN_BODY)})` }}
            />
          </span>
          <span id="review-body-count" className={`shrink-0 text-xs font-medium ${needed ? "text-muted" : "text-ok-ink"}`}>
            {needed ? `${needed} more character${needed === 1 ? "" : "s"}` : `${bodyLength} / ${MAX_BODY}`}
          </span>
        </div>
        <FieldError message={state.errors?.body} />
      </div>

      <FormMessage ok={state.ok} message={state.errors?.form ?? state.message} />
      <SubmitButton pending={pending} variant="cta" pendingText="Posting…">{existing ? "Update review" : "Post review"}</SubmitButton>
    </form>
  );
}
