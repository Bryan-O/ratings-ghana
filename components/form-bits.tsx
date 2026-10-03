"use client";

import { STALE_MESSAGE } from "@/lib/actions/safe-action";

export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

export function FormMessage({ ok, message }: { ok?: boolean; message?: string }) {
  if (!message) return null;
  return (
    <div
      role={ok ? "status" : "alert"}
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${ok ? "border-green-200 bg-cta-soft text-green-900" : "border-red-200 bg-red-50 text-red-800"}`}
    >
      <span>{message}</span>
      {message === STALE_MESSAGE && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-10 cursor-pointer items-center rounded-lg bg-red-700 px-4 font-semibold text-white transition-colors duration-200 hover:bg-red-800"
        >
          Reload page
        </button>
      )}
    </div>
  );
}
