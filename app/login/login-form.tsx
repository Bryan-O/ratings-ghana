"use client";

import { useActionState } from "react";
import { loginAction, resendVerificationAction } from "@/lib/actions/auth";
import { initialState } from "@/lib/actions/state";
import { FieldError, FormMessage, inputClass } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(loginAction, initialState);
  const [resend, resendAction] = useActionState(resendVerificationAction, initialState);
  const unverified = state.data?.unverifiedEmail;

  return (
    <>
      <form action={action} className="flex flex-col gap-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="johndoe@email.com" defaultValue={state.values?.email} className={inputClass} />
          <FieldError message={state.errors?.email} />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Password" className={inputClass} />
          <FieldError message={state.errors?.password} />
        </div>
        <FormMessage message={state.errors?.form} />
        <SubmitButton pendingText="Logging in…" className="text-base">Log in</SubmitButton>
      </form>
      {unverified && (
        <form action={resendAction} className="mt-3 text-center text-sm">
          <input type="hidden" name="email" value={unverified} />
          {resend.message ? (
            <p className="text-muted">{resend.message}</p>
          ) : (
            <button type="submit" className="font-semibold underline">Resend verification email</button>
          )}
        </form>
      )}
    </>
  );
}
