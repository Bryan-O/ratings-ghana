"use client";

import { registerAction } from "@/lib/actions/auth";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";
import { input, label } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";


export function RegisterForm() {
  const [state, onSubmit, pending] = useFormAction(registerAction);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="name" className={label}>Full name</label>
        <input id="name" name="name" autoComplete="name" placeholder="Ama Mensah" defaultValue={state.values?.name} className={input} />
        <FieldError message={state.errors?.name} />
      </div>
      <div>
        <label htmlFor="email" className={label}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="ama@example.com" defaultValue={state.values?.email} className={input} />
        <FieldError message={state.errors?.email} />
      </div>
      <div>
        <label htmlFor="password" className={label}>Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters, with a number" className={input} />
        <FieldError message={state.errors?.password} />
      </div>
      <FormMessage message={state.errors?.form} />
      <SubmitButton pending={pending} variant="cta" pendingText="Creating account…">Create account</SubmitButton>
    </form>
  );
}
