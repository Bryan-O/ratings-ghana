"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { suggestBusinessAction } from "@/lib/actions/businesses";
import { CATEGORIES, REGIONS } from "@/lib/constants";
import { FieldError, FormMessage } from "@/components/form-bits";
import { CheckIcon, GlobeIcon, StoreIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { btn, card, input, label, textarea, press } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";


const TYPES = [
  { value: "PHYSICAL", text: "Physical location", hint: "Shop, restaurant, office…", icon: StoreIcon },
  { value: "ONLINE", text: "Online only", hint: "Website, Instagram, WhatsApp…", icon: GlobeIcon },
];

export function SuggestBusinessForm() {
  const [state, onSubmit, pending] = useFormAction(suggestBusinessAction);
  const v = state.values ?? {};
  const [type, setType] = useState(v.type || "PHYSICAL");
  const e = state.errors ?? {};
  const select = `${input} cursor-pointer appearance-none`;
  const formRef = useRef<HTMLFormElement>(null);

  // Errors for fields that don't have their own message slot still get shown.
  const shown = new Set(["name", "category", "description", "website", "form", ...(type === "PHYSICAL" ? ["address", "city"] : [])]);
  const otherErrors = Object.entries(e)
    .filter(([k, msg]) => !shown.has(k) && msg)
    .map(([, msg]) => msg);
  const formMessage = [e.form, ...otherErrors].filter(Boolean).join(" ") || undefined;

  // After a failed submit, bring the first error into view.
  useEffect(() => {
    if (!state.errors) return;
    const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]');
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (first?.matches("input, select, textarea")) first.focus({ preventScroll: true });
  }, [state]);

  if (state.ok) {
    return (
      <div className={`${card} flex flex-col items-center p-10 text-center`}>
        <span className="flex size-14 animate-pop items-center justify-center rounded-full bg-cta-soft text-ok-ink"><CheckIcon size={28} /></span>
        <p className="mt-5 max-w-md animate-rise font-display text-xl font-bold text-ink">{state.message}</p>
        <p className="mt-2 text-muted">You can follow its status on My submissions.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/my-submissions" className={btn.primary}>My submissions</Link>
          <Link href="/businesses" className={btn.outline}>Back to businesses</Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className={`${card} flex flex-col gap-6 p-6 sm:p-8`} noValidate>
      <div>
        <label htmlFor="name" className={label}>Business name</label>
        <input id="name" name="name" defaultValue={v.name} className={input} aria-invalid={Boolean(e.name)} />
        <FieldError message={e.name} />
        {state.data?.duplicateSlug && (
          <Link href={`/businesses/${state.data.duplicateSlug}`} className="mt-1.5 inline-block text-sm font-semibold text-brand underline">
            View the existing listing
          </Link>
        )}
      </div>

      <fieldset>
        <legend className={label}>Type</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map(({ value, text, hint, icon: Icon }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 ${press} has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                type === value ? "border-ink bg-brand-wash" : "border-line hover:border-ink/50"
              }`}
            >
              <input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} className="sr-only" />
              <span className={`flex size-10 items-center justify-center rounded-lg transition-colors duration-200 ${type === value ? "bg-coral text-ink" : "bg-brand-wash text-ink"}`}>
                <Icon size={20} />
              </span>
              <span>
                <span className="block font-semibold text-ink">{text}</span>
                <span className="text-sm text-muted">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="category" className={label}>Category</label>
        <select id="category" name="category" defaultValue={v.category ?? ""} className={select} aria-invalid={Boolean(e.category)}>
          <option value="" disabled>Select a category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <FieldError message={e.category} />
      </div>

      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={v.description} className={textarea} aria-invalid={Boolean(e.description)} placeholder="What does this business do or sell?" />
        <FieldError message={e.description} />
      </div>

      {type === "PHYSICAL" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="address" className={label}>Address or landmark</label>
            <input id="address" name="address" defaultValue={v.address} className={input} aria-invalid={Boolean(e.address)} placeholder="e.g. Opposite Rakho Primary School, Kotei" />
            <FieldError message={e.address} />
          </div>
          <div>
            <label htmlFor="city" className={label}>Town / city</label>
            <input id="city" name="city" defaultValue={v.city} className={input} aria-invalid={Boolean(e.city)} />
            <FieldError message={e.city} />
          </div>
          <div>
            <label htmlFor="region" className={label}>Region</label>
            <select id="region" name="region" defaultValue={v.region ?? ""} className={select}>
              <option value="">Select a region</option>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="website" className={label}>
          Website or social page {type === "PHYSICAL" && <span className="font-normal text-muted">(optional)</span>}
        </label>
        <input id="website" name="website" type="url" defaultValue={v.website} className={input} aria-invalid={Boolean(e.website)} placeholder="https://" />
        <FieldError message={e.website} />
      </div>

      <div>
        <label htmlFor="phone" className={label}>Business phone <span className="font-normal text-muted">(optional)</span></label>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} className={input} />
      </div>

      <FormMessage message={formMessage} />
      <SubmitButton pending={pending} variant="cta" pendingText="Submitting…" className="sm:w-auto sm:self-start">Submit for review</SubmitButton>
    </form>
  );
}
