"use client";

import { testSmsAction } from "@/lib/actions/admin";
import type { SetupCheck } from "@/lib/setup-status";
import { AlertIcon, CheckIcon } from "@/components/icons";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";
import { input, label } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";

/** Admin panel: which services are configured, plus a "send a test text" tool. Opens itself when something is wrong. */
export function SetupCheckPanel({ checks }: { checks: SetupCheck[] }) {
  const problems = checks.filter((c) => !c.ok).length;
  const [state, onSubmit, pending] = useFormAction(testSmsAction);

  return (
    <details open={problems > 0} className="group mb-10 rounded-2xl border border-line bg-paper">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3">
        <span className="flex items-center gap-3">
          <span className={`flex size-9 items-center justify-center rounded-xl ${problems ? "bg-coral-soft text-coral-ink" : "bg-cta-soft text-ok-ink"}`}>
            {problems ? <AlertIcon size={18} /> : <CheckIcon size={18} />}
          </span>
          <span>
            <span className="block font-display font-bold text-ink">Setup check</span>
            <span className="text-sm text-muted">{problems ? `${problems} thing${problems === 1 ? "" : "s"} to fix` : "Email, SMS and photo storage are configured"}</span>
          </span>
        </span>
        <span className="text-sm font-semibold text-brand group-open:hidden">Show</span>
        <span className="hidden text-sm font-semibold text-brand group-open:inline">Hide</span>
      </summary>
      <div className="border-t border-line px-5 py-5">
        <ul className="divide-y divide-line">
          {checks.map((c) => (
            <li key={c.area} className="flex items-start gap-3 py-2.5 text-sm">
              <span className={`mt-0.5 shrink-0 ${c.ok ? "text-ok-ink" : "text-coral-ink"}`}>{c.ok ? <CheckIcon size={16} /> : <AlertIcon size={16} />}</span>
              <span className="min-w-0">
                <span className="font-semibold text-ink">{c.area}</span>
                <span className="block break-words text-muted">{c.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 rounded-xl bg-brand-wash p-4" noValidate>
          <div>
            <label htmlFor="test-sms-phone" className={label}>Send a test text</label>
            <p className="mb-2 text-sm text-muted">Shows exactly what the SMS provider says if it fails.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="test-sms-phone" name="phone" type="tel" inputMode="tel" defaultValue={state.values?.phone} placeholder="024 123 4567" className={input} aria-invalid={Boolean(state.errors?.phone)} />
              <SubmitButton pending={pending} pendingText="Sending…" className="sm:w-auto sm:shrink-0">Send test</SubmitButton>
            </div>
            <FieldError message={state.errors?.phone} />
          </div>
          <FormMessage ok={state.ok} message={state.errors?.form ?? state.message} />
        </form>
      </div>
    </details>
  );
}
