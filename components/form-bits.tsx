"use client";

import { useEffect, useRef } from "react";
import { STALE_MESSAGE } from "@/lib/actions/safe-action";
import { shake } from "@/lib/motion";
import { FORM_ERRORS_EVENT } from "@/lib/use-form-action";
import { AlertIcon, CheckIcon } from "@/components/icons";

/**
 * Field-level error. Each time its form comes back with errors (FORM_ERRORS_EVENT), the field it
 * belongs to shakes once: the nearest [data-shake-target], else the input in the same group.
 */
export function FieldError({ message, id }: { message?: string; id?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    const form = el?.closest("form");
    if (!el || !form) return;
    const group = el.parentElement;
    const target = group?.querySelector("[data-shake-target]") ?? group?.querySelector("input:not([type=hidden]):not(.sr-only), textarea, select");
    const run = () => shake(target);
    form.addEventListener(FORM_ERRORS_EVENT, run);
    return () => form.removeEventListener(FORM_ERRORS_EVENT, run);
  }, [message]);
  if (!message) return null;
  return (
    <p ref={ref} id={id} role="alert" className="mt-1.5 flex animate-drop items-center gap-1.5 text-sm font-medium text-coral-ink">
      <AlertIcon size={14} className="shrink-0" />
      {message}
    </p>
  );
}

/** Form-level result: a green confirmation that pops in, or a coral-edged callout for errors. */
export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  if (!message) return null;
  return (
    <div
      key={message}
      role={ok ? "status" : "alert"}
      className={`flex animate-rise flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
        ok ? "bg-cta-soft text-ok-ink" : "border-l-4 border-coral bg-coral-soft text-ink"
      }`}
    >
      <span className="flex items-center gap-2.5">
        {ok && (
          <span className="flex size-6 shrink-0 animate-pop items-center justify-center rounded-full bg-ok-ink text-white">
            <CheckIcon size={14} />
          </span>
        )}
        {message}
      </span>
      {message === STALE_MESSAGE && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-10 cursor-pointer items-center rounded-xl bg-ink px-4 font-semibold text-white transition-colors duration-200 hover:bg-coral hover:text-ink"
        >
          Reload page
        </button>
      )}
    </div>
  );
}
