"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { initialState } from "@/lib/actions/state";
import { FieldError, FormMessage, inputClass } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";

export function RegisterForm() {
  const [state, action] = useActionState(registerAction, initialState);
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-xs font-medium text-ink">Full name</label>
        <input id="name" name="name" autoComplete="name" placeholder="Ama Mensah" defaultValue={state.values?.name} className={inputClass} />
        <FieldError message={state.errors?.name} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-xs font-medium text-ink">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="johndoe@email.com" defaultValue={state.values?.email} className={inputClass} />
        <FieldError message={state.errors?.email} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-xs font-medium text-ink">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters, with a number" className={inputClass} />
        <FieldError message={state.errors?.password} />
      </div>
      <FormMessage message={state.errors?.form} />
      <SubmitButton pendingText="Creating account…" className="text-base">Create account</SubmitButton>
    </form>
  );
}
