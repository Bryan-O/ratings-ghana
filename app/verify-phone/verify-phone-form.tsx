"use client";

import { useActionState, useState } from "react";
import { sendPhoneOtpAction, verifyPhoneOtpAction } from "@/lib/actions/phone";
import { initialState } from "@/lib/actions/state";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";
import { input, label } from "@/components/ui";

export function VerifyPhoneForm({ next }: { next: string }) {
  const [sendState, sendAction] = useActionState(sendPhoneOtpAction, initialState);
  const [verifyState, verifyAction] = useActionState(verifyPhoneOtpAction, initialState);
  const [changeNumber, setChangeNumber] = useState(false);

  const codeSent = sendState.data?.step === "code" && !changeNumber;
  const maskedPhone = sendState.data?.maskedPhone ?? verifyState.data?.maskedPhone;

  if (!codeSent) {
    return (
      <form action={(fd) => { setChangeNumber(false); return sendAction(fd); }} className="flex flex-col gap-5" noValidate>
        <div>
          <label htmlFor="phone" className={label}>Ghana mobile number</label>
          <div className="flex">
            <span className="flex h-12 items-center rounded-l-xl border border-r-0 border-line-strong bg-brand-soft px-4 font-semibold text-brand-deep">+233</span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="024 123 4567"
              defaultValue={sendState.values?.phone}
              className={`${input} rounded-l-none`}
            />
          </div>
          <FieldError message={sendState.errors?.phone} />
        </div>
        <FormMessage ok={sendState.ok} message={sendState.errors?.form ?? sendState.message} />
        <SubmitButton pendingText="Sending code…">Send code</SubmitButton>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form action={verifyAction} className="flex flex-col gap-5" noValidate>
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="maskedPhone" value={maskedPhone ?? ""} />
        <div>
          <label htmlFor="code" className={label}>
            Enter the 6-digit code sent to {maskedPhone}
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            placeholder="••••••"
            className={`${input} h-14 text-center font-display text-2xl tracking-[0.5em]`}
            autoFocus
          />
          <FieldError message={verifyState.errors?.code} />
        </div>
        <SubmitButton variant="cta" pendingText="Verifying…">Verify</SubmitButton>
      </form>
      <button type="button" onClick={() => setChangeNumber(true)} className="cursor-pointer text-center text-sm font-semibold text-brand underline underline-offset-2">
        Use a different number or resend code
      </button>
    </div>
  );
}
