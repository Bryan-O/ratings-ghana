"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { withRecovery } from "@/lib/actions/safe-action";
import { initialState, type ActionState } from "@/lib/actions/state";

/** Dispatched on a form each time its submit comes back with errors. */
export const FORM_ERRORS_EVENT = "form:errors";

/**
 * useActionState for our forms, submitted via onSubmit instead of <form action>.
 *
 * React automatically resets a form after a `<form action>` submission. That snaps
 * selects and radios (business type, category, star rating) back to their initial
 * state while React state still shows the user's choice — so fixing one error and
 * resubmitting silently sent the wrong values. Submitting through a transition keeps
 * the form exactly as the user left it. Failures are turned into visible messages
 * by withRecovery (e.g. a page from an older deployment).
 *
 * Each time a submit comes back with errors, the form element receives a FORM_ERRORS_EVENT,
 * which FieldError uses to shake its field (also when the same error repeats).
 */
export function useFormAction(
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>,
  initial: ActionState = initialState,
) {
  const [recovering] = useState(() => withRecovery(action));
  const [state, dispatch, pending] = useActionState(recovering, initial);
  const form = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.errors && form.current) form.current.dispatchEvent(new Event(FORM_ERRORS_EVENT));
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    form.current = event.currentTarget;
    // Include the clicked submit button (e.g. name="intent" value="approve").
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter?.getAttribute("name") ? submitter : null);
    startTransition(() => dispatch(formData));
  }

  return [state, onSubmit, pending] as const;
}
