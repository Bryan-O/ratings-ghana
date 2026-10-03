"use client";

import { useActionState, useState } from "react";
import { sendPhoneOtpAction, verifyPhoneOtpAction } from "@/lib/actions/phone";
import { initialState } from "@/lib/actions/state";
import { FieldError, FormMessage, inputClass } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";

export function VerifyPhoneForm({ next }: { next: string }) {
  const [sendState, sendAction] = useActionState(sendPhoneOtpAction, initialState);
  const [verifyState, verifyAction] = useActionState(verifyPhoneOtpAction, initialState);
  const [changeNumber, setChangeNumber] = useState(false);

  const codeSent = sendState.data?.step === "code" && !changeNumber;
  const maskedPhone = sendState.data?.maskedPhone ?? verifyState.data?.maskedPhone;

  if (!codeSent) {
    return (
      <form action={(fd) => { setChangeNumber(false); return sendAction(fd); }} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="phone" className="mb-1 block text-xs font-medium text-ink">Ghana mobile number</label>
          <div className="flex">
            <span className="flex h-11 items-center rounded-l-[4px] border border-r-0 border-[#d9d9d9] bg-[#f6f6f6] px-3 text-sm text-muted">+233</span>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="024 123 4567"
              defaultValue={sendState.values?.phone}
              className={`${inputClass} rounded-l-none`}
            />
          </div>
          <FieldError message={sendState.errors?.phone} />
        </div>
        <FormMessage ok={sendState.ok} message={sendState.errors?.form ?? sendState.message} />
        <SubmitButton pendingText="Sending code…" className="text-base">Send code</SubmitButton>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form action={verifyAction} className="flex flex-col gap-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <input type="hidden" name="maskedPhone" value={maskedPhone ?? ""} />
        <div>
          <label htmlFor="code" className="mb-1 block text-xs font-medium text-ink">
            Enter the 6-digit code sent to {maskedPhone}
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            placeholder="123456"
            className={`${inputClass} text-center text-lg tracking-[0.5em]`}
            autoFocus
          />
          <FieldError message={verifyState.errors?.code} />
        </div>
        <SubmitButton pendingText="Verifying…" className="text-base">Verify</SubmitButton>
      </form>
      <button type="button" onClick={() => setChangeNumber(true)} className="text-center text-sm font-semibold underline">
        Use a different number or resend code
      </button>
    </div>
  );
}
