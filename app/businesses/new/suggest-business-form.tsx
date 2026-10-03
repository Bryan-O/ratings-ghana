"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { suggestBusinessAction } from "@/lib/actions/businesses";
import { initialState } from "@/lib/actions/state";
import { CATEGORIES, REGIONS } from "@/lib/constants";
import { FieldError, FormMessage } from "@/components/form-bits";
import { CheckIcon, GlobeIcon, StoreIcon } from "@/components/icons";
import { SubmitButton } from "@/components/submit-button";
import { btn, card, input, label, textarea } from "@/components/ui";

const TYPES = [
  { value: "PHYSICAL", text: "Physical location", hint: "Shop, restaurant, office…", icon: StoreIcon },
  { value: "ONLINE", text: "Online only", hint: "Website, Instagram, WhatsApp…", icon: GlobeIcon },
];

export function SuggestBusinessForm() {
  const [state, action] = useActionState(suggestBusinessAction, initialState);
  const v = state.values ?? {};
  const [type, setType] = useState(v.type || "PHYSICAL");
  const e = state.errors ?? {};
  const select = `${input} cursor-pointer appearance-none`;

  if (state.ok) {
    return (
      <div className={`${card} flex flex-col items-center p-10 text-center`}>
        <span className="flex size-14 items-center justify-center rounded-full bg-cta-soft text-cta"><CheckIcon size={28} /></span>
        <p className="mt-5 font-display text-xl font-semibold text-ink">{state.message}</p>
        <Link href="/businesses" className={`${btn.primary} mt-6`}>Back to businesses</Link>
      </div>
    );
  }

  return (
    <form action={action} className={`${card} flex flex-col gap-6 p-6 sm:p-8`} noValidate>
      <div>
        <label htmlFor="name" className={label}>Business name</label>
        <input id="name" name="name" defaultValue={v.name} className={input} />
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
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                type === value ? "border-brand bg-brand-soft" : "border-line hover:border-brand-light"
              }`}
            >
              <input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} className="sr-only" />
              <span className={`flex size-10 items-center justify-center rounded-lg ${type === value ? "bg-brand text-white" : "bg-brand-soft text-brand"}`}>
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
        <select id="category" name="category" defaultValue={v.category || CATEGORIES[0]} className={select}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <FieldError message={e.category} />
      </div>

      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={v.description} className={textarea} placeholder="What does this business do or sell?" />
        <FieldError message={e.description} />
      </div>

      {type === "PHYSICAL" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="address" className={label}>Address or landmark</label>
            <input id="address" name="address" defaultValue={v.address} className={input} placeholder="e.g. Opposite Rakho Primary School, Kotei" />
            <FieldError message={e.address} />
          </div>
          <div>
            <label htmlFor="city" className={label}>Town / city</label>
            <input id="city" name="city" defaultValue={v.city} className={input} />
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
        <input id="website" name="website" type="url" defaultValue={v.website} className={input} placeholder="https://" />
        <FieldError message={e.website} />
      </div>

      <div>
        <label htmlFor="phone" className={label}>Business phone <span className="font-normal text-muted">(optional)</span></label>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} className={input} />
      </div>

      <FormMessage message={e.form} />
      <SubmitButton variant="cta" pendingText="Submitting…" className="sm:w-auto sm:self-start">Submit for review</SubmitButton>
    </form>
  );
}
