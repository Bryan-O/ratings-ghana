"use client";

import { useActionState, useState } from "react";
import { submitReviewAction } from "@/lib/actions/reviews";
import { initialState } from "@/lib/actions/state";
import { StarIcon } from "@/components/icons";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";

const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

type Props = {
  businessId: string;
  existing?: { rating: number; title: string; body: string };
};

/** Figma "Frame 54" — stars, title, details, Submit. */
export function ReviewForm({ businessId, existing }: Props) {
  const [state, action] = useActionState(submitReviewAction, initialState);
  const v = state.values;
  const [rating, setRating] = useState<number>(Number(v?.rating) || existing?.rating || 0);
  const [hover, setHover] = useState(0);
  const shown = hover || rating;

  return (
    <form action={action} className="flex flex-col gap-[13px]" noValidate>
      <input type="hidden" name="businessId" value={businessId} />
      <div className="rounded-[4px] bg-white px-[7px] pb-4">
        <fieldset className="border-t border-[#d9d9d9] pt-2" onMouseLeave={() => setHover(0)}>
          <legend className="sr-only">Your rating</legend>
          <div className="flex items-center gap-[3px]">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="cursor-pointer text-star" onMouseEnter={() => setHover(n)}>
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => setRating(n)}
                  className="peer sr-only"
                  aria-label={`${n} star${n > 1 ? "s" : ""} — ${LABELS[n - 1]}`}
                />
                <StarIcon size={26} filled={n <= shown} className="rounded peer-focus-visible:outline-2 peer-focus-visible:outline-ink" />
              </label>
            ))}
            <span className="ml-2 text-xs text-muted" aria-live="polite">{shown ? LABELS[shown - 1] : ""}</span>
          </div>
          <FieldError message={state.errors?.rating} />
        </fieldset>

        <div className="mt-2 border-t border-[#d9d9d9] pt-2">
          <label htmlFor="review-title" className="sr-only">Title</label>
          <input
            id="review-title"
            name="title"
            maxLength={100}
            defaultValue={v?.title ?? existing?.title}
            placeholder="TITLE"
            className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-xs placeholder:text-faint"
          />
          <FieldError message={state.errors?.title} />
        </div>

        <div className="mt-2 border-t border-[#d9d9d9] pt-2">
          <label htmlFor="review-body" className="sr-only">Your experience</label>
          <textarea
            id="review-body"
            name="body"
            rows={7}
            maxLength={3000}
            defaultValue={v?.body ?? existing?.body}
            placeholder="Share details of your experience with this company..."
            className="w-full resize-y bg-transparent text-sm outline-none placeholder:text-xs placeholder:text-faint"
          />
          <FieldError message={state.errors?.body} />
        </div>
      </div>

      <FormMessage ok={state.ok} message={state.errors?.form ?? state.message} />
      <SubmitButton pendingText="Submitting…">{existing ? "Update review" : "Submit"}</SubmitButton>
    </form>
  );
}
