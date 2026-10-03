"use client";

import { useState } from "react";
import { submitReviewAction } from "@/lib/actions/reviews";
import { StarIcon } from "@/components/icons";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";
import { input, label, textarea } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";


const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

type Props = {
  businessId: string;
  existing?: { rating: number; title: string; body: string };
};

export function ReviewForm({ businessId, existing }: Props) {
  const [state, onSubmit, pending] = useFormAction(submitReviewAction);
  const v = state.values;
  const [rating, setRating] = useState<number>(Number(v?.rating) || existing?.rating || 0);
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="businessId" value={businessId} />

      <fieldset onMouseLeave={() => setHover(0)}>
        <legend className={label}>Your rating</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                className="peer sr-only"
                aria-label={`${n} star${n > 1 ? "s" : ""} — ${LABELS[n - 1]}`}
              />
              <span className="flex size-11 items-center justify-center rounded-xl transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-brand hover:bg-brand-soft">
                <StarIcon size={30} className={n <= shown ? "text-star" : "text-star-empty"} />
              </span>
            </label>
          ))}
        </div>
        <p className="mt-1 h-5 text-sm font-semibold text-brand-deep" aria-live="polite">{shown ? LABELS[shown - 1] : ""}</p>
        <FieldError message={state.errors?.rating} />
      </fieldset>

      <div>
        <label htmlFor="review-title" className={label}>Title</label>
        <input id="review-title" name="title" maxLength={100} defaultValue={v?.title ?? existing?.title} placeholder="Sum up your experience" className={input} />
        <FieldError message={state.errors?.title} />
      </div>

      <div>
        <label htmlFor="review-body" className={label}>Your review</label>
        <textarea
          id="review-body"
          name="body"
          rows={6}
          maxLength={3000}
          defaultValue={v?.body ?? existing?.body}
          placeholder="What happened? How was the service, quality and value?"
          className={`${textarea} resize-y`}
        />
        <FieldError message={state.errors?.body} />
      </div>

      <FormMessage ok={state.ok} message={state.errors?.form ?? state.message} />
      <SubmitButton pending={pending} variant="cta" pendingText="Posting…">{existing ? "Update review" : "Post review"}</SubmitButton>
    </form>
  );
}
