"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { suggestBusinessAction } from "@/lib/actions/businesses";
import { initialState } from "@/lib/actions/state";
import { CATEGORIES, REGIONS } from "@/lib/constants";
import { FieldError, FormMessage, inputClass } from "@/components/form-bits";
import { SubmitButton } from "@/components/submit-button";

const label = "mb-1 block text-sm font-medium text-ink";

export function SuggestBusinessForm() {
  const [state, action] = useActionState(suggestBusinessAction, initialState);
  const v = state.values ?? {};
  const [type, setType] = useState(v.type || "PHYSICAL");
  const e = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="mt-6 rounded-[4px] bg-green-50 p-5 text-green-800">
        <p>{state.message}</p>
        <Link href="/businesses" className="mt-3 inline-block font-semibold underline">Back to businesses</Link>
      </div>
    );
  }

  return (
    <form action={action} className="mt-6 flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="name" className={label}>Business name</label>
        <input id="name" name="name" defaultValue={v.name} className={inputClass} />
        <FieldError message={e.name} />
        {state.data?.duplicateSlug && (
          <Link href={`/businesses/${state.data.duplicateSlug}`} className="mt-1 inline-block text-sm font-semibold underline">
            View the existing listing
          </Link>
        )}
      </div>

      <fieldset>
        <legend className={label}>Type</legend>
        <div className="flex gap-3">
          {[
            ["PHYSICAL", "Physical location"],
            ["ONLINE", "Online only"],
          ].map(([value, text]) => (
            <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-[4px] border px-3 py-2 text-sm ${type === value ? "border-ink" : "border-[#d9d9d9]"}`}>
              <input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} />
              {text}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="category" className={label}>Category</label>
        <select id="category" name="category" defaultValue={v.category || CATEGORIES[0]} className={inputClass}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <FieldError message={e.category} />
      </div>

      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={v.description} className={`${inputClass} h-auto py-2`} placeholder="What does this business do?" />
        <FieldError message={e.description} />
      </div>

      {type === "PHYSICAL" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="address" className={label}>Address or landmark</label>
            <input id="address" name="address" defaultValue={v.address} className={inputClass} placeholder="e.g. Opposite Rakho Primary School, Kotei" />
            <FieldError message={e.address} />
          </div>
          <div>
            <label htmlFor="city" className={label}>Town / city</label>
            <input id="city" name="city" defaultValue={v.city} className={inputClass} />
            <FieldError message={e.city} />
          </div>
          <div>
            <label htmlFor="region" className={label}>Region</label>
            <select id="region" name="region" defaultValue={v.region ?? ""} className={inputClass}>
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
        <input id="website" name="website" type="url" defaultValue={v.website} className={inputClass} placeholder="https://" />
        <FieldError message={e.website} />
      </div>

      <div>
        <label htmlFor="phone" className={label}>Business phone <span className="font-normal text-muted">(optional)</span></label>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} className={inputClass} />
      </div>

      <FormMessage message={e.form} />
      <SubmitButton pendingText="Submitting…" className="text-base sm:w-60">Submit for review</SubmitButton>
    </form>
  );
}
