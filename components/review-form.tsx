"use client";

import { useState } from "react";
import { submitReviewAction } from "@/lib/actions/reviews";
import { StarIcon } from "@/components/icons";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";
import { input, label, textarea } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";
import { STAGGER } from "@/lib/motion";


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
  // Per-star animation keys and delays: bumping a star's key replays its pop.
  const [pops, setPops] = useState<{ keys: number[]; delays: number[] }>({ keys: [0, 0, 0, 0, 0], delays: [0, 0, 0, 0, 0] });
  const [spark, setSpark] = useState<{ star: number; id: number } | null>(null);
  const [bodyLength, setBodyLength] = useState((v?.body ?? existing?.body ?? "").trim().length);
  const needed = Math.max(0, MIN_BODY - bodyLength);
  const shown = hover || rating;

  /** Pop stars from+1..to one after another (45ms apart). */
  function popRange(from: number, to: number) {
    if (to <= from) return;
    setPops((p) => ({
      keys: p.keys.map((k, i) => (i + 1 > from && i + 1 <= to ? k + 1 : k)),
      delays: p.delays.map((d, i) => (i + 1 > from && i + 1 <= to ? (i - from) * STAGGER.stars : d)),
    }));
  }

  function preview(n: number) {
    popRange(shown, n);
    setHover(n);
  }

  function lock(n: number) {
    setRating(n);
    popRange(0, n); // re-pop every selected star, then burst on the chosen one
    setSpark((s) => ({ star: n, id: (s?.id ?? 0) + 1 }));
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="businessId" value={businessId} />

      <fieldset onMouseLeave={() => setHover(0)}>
        <legend className={label}>Your rating</legend>
        {/*
          Five large tappable stars on light coral tiles. Hover previews the rating (stars pop in one
          after another); tapping locks it with a pop and a small burst. Keyboard: arrow keys.
        */}
        <div data-shake-target="" className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => {
            const on = n <= shown;
            return (
              <label key={n} className="cursor-pointer" onMouseEnter={() => preview(n)}>
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => lock(n)}
                  className="peer sr-only"
                  aria-label={`${n} star${n > 1 ? "s" : ""} — ${LABELS[n - 1]}`}
                />
                <span
                  className={`relative flex size-12 items-center justify-center rounded-xl transition-[background-color,scale] duration-150 ease-spring peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand active:scale-90 ${
                    on ? "bg-coral-tint" : "bg-coral-soft hover:bg-coral-tint"
                  }`}
                >
                  <span
                    key={on ? `on-${pops.keys[n - 1]}` : "off"}
                    className={on && pops.keys[n - 1] > 0 ? "animate-star-pop" : ""}
                    style={{ animationDelay: `${pops.delays[n - 1]}ms` }}
                  >
                    <StarIcon size={28} filled={on} className={`transition-colors duration-150 ${on ? "text-star" : "text-star-empty"}`} />
                  </span>
                  {spark?.star === n && <Spark key={spark.id} />}
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

/** Six coral particles bursting out of a star when a rating is locked in. Decorative only. */
function Spark() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <span
          key={deg}
          className={`absolute top-1/2 left-1/2 -mt-1 -ml-1 size-2 animate-spark rounded-full ${i % 2 ? "bg-brand" : "bg-coral"}`}
          style={{ "--spark-angle": `${deg + 30}deg` } as React.CSSProperties}
        />
      ))}
    </span>
  );
}
