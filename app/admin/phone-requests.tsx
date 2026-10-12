"use client";

import { declinePhoneRequestAction, verifyPhoneRequestAction } from "@/lib/actions/admin";
import { FormMessage } from "@/components/form-bits";
import { btn } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";

export type PhoneRequest = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  phone: string;
  requestedAgo: string;
  takenByAnother: boolean;
  sharedRequest: boolean;
};

/** One manual phone-verification request with Verify / Decline. */
export function PhoneRequestRow({ r }: { r: PhoneRequest }) {
  const [verifyState, onVerify, verifying] = useFormAction(verifyPhoneRequestAction);
  const [declineState, onDecline, declining] = useFormAction(declinePhoneRequestAction);
  const done = verifyState.ok || declineState.ok;

  return (
    <li className={`flex flex-col gap-3 rounded-2xl border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between ${done ? "opacity-60" : ""}`}>
      <div className="min-w-0">
        <p className="font-semibold text-ink">
          {r.name ?? "No name"} <span className="font-normal break-all text-muted">· {r.email}</span>
        </p>
        <p className="mt-1 font-display text-lg font-bold text-ink">{r.phone}</p>
        <p className="mt-0.5 text-sm text-muted">Asked {r.requestedAgo}</p>
        {!r.emailVerified && <p className="mt-1 text-sm font-medium text-coral-ink">Email not verified yet.</p>}
        {r.takenByAnother && <p className="mt-1 text-sm font-medium text-coral-ink">This number already backs another account.</p>}
        {r.sharedRequest && <p className="mt-1 text-sm font-medium text-coral-ink">Someone else asked for this number too.</p>}
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
        {done ? (
          <FormMessage ok message={verifyState.message ?? declineState.message} />
        ) : (
          <div className="flex gap-2">
            <form onSubmit={onVerify}>
              <input type="hidden" name="id" value={r.id} />
              <button type="submit" disabled={verifying || declining || r.takenByAnother} className={btn.smPrimary}>
                {verifying ? "Verifying…" : "Verify"}
              </button>
            </form>
            <form onSubmit={onDecline}>
              <input type="hidden" name="id" value={r.id} />
              <button type="submit" disabled={verifying || declining} className={btn.smOutline}>
                {declining ? "Declining…" : "Decline"}
              </button>
            </form>
          </div>
        )}
        <FormMessage message={verifyState.errors?.form ?? declineState.errors?.form} />
      </div>
    </li>
  );
}
