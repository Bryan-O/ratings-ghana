"use client";

import { STALE_MESSAGE } from "@/lib/actions/safe-action";
import { AlertIcon, CheckIcon } from "@/components/icons";

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex animate-drop items-center gap-1.5 text-sm font-medium text-coral-ink">
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
