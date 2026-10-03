"use client";

import { useActionState } from "react";
import { loginAction, resendVerificationAction } from "@/lib/actions/auth";
import { initialState } from "@/lib/actions/state";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";
import { input, label } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(loginAction, initialState);
  const [resend, resendAction] = useActionState(resendVerificationAction, initialState);
  const unverified = state.data?.unverifiedEmail;

  return (
    <>
      <form action={action} className="flex flex-col gap-5" noValidate>
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="johndoe@email.com" defaultValue={state.values?.email} className={input} aria-invalid={Boolean(state.errors?.email)} />
          <FieldError message={state.errors?.email} />
        </div>
        <div>
          <label htmlFor="password" className={label}>Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Password" className={input} aria-invalid={Boolean(state.errors?.password)} />
          <FieldError message={state.errors?.password} />
        </div>
        <FormMessage message={state.errors?.form} />
        <SubmitButton pendingText="Logging in…">Log in</SubmitButton>
      </form>
      {unverified && (
        <form action={resendAction} className="mt-4 text-center text-sm">
          <input type="hidden" name="email" value={unverified} />
          {resend.message ? (
            <p className="text-muted">{resend.message}</p>
          ) : (
            <button type="submit" className="cursor-pointer font-semibold text-brand underline underline-offset-2">Resend verification email</button>
          )}
        </form>
      )}
    </>
  );
}
