"use client";

import { useRef, useState } from "react";
import { submitFeedbackAction } from "@/lib/actions/feedback";
import { CheckIcon, CloseIcon, MessageIcon } from "@/components/icons";
import { FieldError, FormMessage } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";
import { btn, input, label, textarea } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";

const TYPES = [
  { value: "BUG", label: "Something's broken" },
  { value: "CONFUSING", label: "Confusing" },
  { value: "IDEA", label: "Idea" },
  { value: "OTHER", label: "Other" },
] as const;

/** Floating "Feedback" button for testers; opens a small form in a native <dialog>. */
export function FeedbackWidget({ signedIn }: { signedIn: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Remounting the form (new key) clears it for "Send another".
  const [formKey, setFormKey] = useState(0);
  // Only render the form while the dialog is open (keeps its fields out of the page otherwise).
  const [open, setOpen] = useState(false);

  function show() {
    setOpen(true);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="group fixed right-4 bottom-4 z-30 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-paper bg-ink px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-coral hover:text-ink active:translate-y-px print:hidden"
        aria-haspopup="dialog"
      >
        <MessageIcon size={18} className="transition-transform duration-200 group-hover:-translate-y-0.5" /> Feedback
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="feedback-title"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        onClose={() => setOpen(false)}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border-2 border-ink bg-paper p-0 text-body backdrop:bg-ink/50 open:animate-rise max-sm:mb-4"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="feedback-title" className="font-display text-xl font-bold">Send feedback</h2>
              <p className="mt-1 text-sm text-muted">Found a bug or have an idea? Tell us what happened.</p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="-mt-1 -mr-2 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted transition-colors duration-200 hover:bg-brand-wash hover:text-ink"
            >
              <CloseIcon size={20} />
            </button>
          </div>
          {open && (
            <FeedbackForm
              key={formKey}
              signedIn={signedIn}
              onClose={() => dialogRef.current?.close()}
              onAnother={() => setFormKey((k) => k + 1)}
            />
          )}
        </div>
      </dialog>
    </>
  );
}

function FeedbackForm({ signedIn, onClose, onAnother }: { signedIn: boolean; onClose: () => void; onAnother: () => void }) {
  const [state, onSubmit, pending] = useFormAction(submitFeedbackAction);
  const [type, setType] = useState<string>(state.values?.type ?? "");
  const e = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="mt-6 flex flex-col items-center text-center" role="status">
        <span className="flex size-14 animate-pop items-center justify-center rounded-full bg-cta-soft text-ok-ink">
          <CheckIcon size={28} />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-ink">Thanks — your feedback was sent.</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onAnother} className={btn.smOutline}>Send another</button>
          <button type="button" onClick={onClose} className={btn.smPrimary}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(ev) => {
        // Capture where the person is and their screen size at the moment they send it.
        const f = ev.currentTarget;
        (f.elements.namedItem("path") as HTMLInputElement).value = window.location.pathname + window.location.search;
        (f.elements.namedItem("viewport") as HTMLInputElement).value = `${window.innerWidth}x${window.innerHeight}`;
        onSubmit(ev);
      }}
      className="mt-5 flex flex-col gap-4"
      noValidate
    >
      <input type="hidden" name="path" defaultValue="/" />
      <input type="hidden" name="viewport" defaultValue="" />
      {/* Honeypot for bots: hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset>
        <legend className={label}>What kind of feedback?</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={`inline-flex h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                type === t.value ? "border-ink bg-ink text-white" : "border-line-strong bg-paper text-ink hover:border-ink"
              }`}
            >
              <input type="radio" name="type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
        <FieldError message={e.type} />
      </fieldset>

      <div>
        <label htmlFor="feedback-message" className={label}>Your message</label>
        <textarea
          id="feedback-message"
          name="message"
          rows={5}
          maxLength={2000}
          defaultValue={state.values?.message}
          placeholder="What happened, or what would make this better?"
          className={textarea}
          aria-invalid={Boolean(e.message)}
        />
        <FieldError message={e.message} />
      </div>

      {!signedIn && (
        <div>
          <label htmlFor="feedback-email" className={label}>
            Email <span className="font-normal text-muted">(optional, so we can follow up)</span>
          </label>
          <input id="feedback-email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} className={input} aria-invalid={Boolean(e.email)} />
          <FieldError message={e.email} />
        </div>
      )}

      <p className="text-xs text-muted">We&apos;ll include the page you&apos;re on and your browser type to help us fix things.</p>
      <FormMessage message={e.form} />
      <SubmitButton pending={pending} pendingText="Sending…">Send feedback</SubmitButton>
    </form>
  );
}
