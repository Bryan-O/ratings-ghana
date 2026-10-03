"use client";

import { useState } from "react";
import { updatePendingBusinessAction } from "@/lib/actions/admin";
import { CATEGORIES, REGIONS } from "@/lib/constants";
import { FieldError, FormMessage } from "@/components/form-bits";
import { btn, input, label, textarea } from "@/components/ui";
import { useFormAction } from "@/lib/use-form-action";

type Editable = {
  id: string;
  name: string;
  type: "PHYSICAL" | "ONLINE";
  category: string;
  description: string;
  address: string | null;
  city: string | null;
  region: string | null;
  website: string | null;
  phone: string | null;
};

/** Inline editor so an admin can fix a pending listing before approving it. */
export function BusinessEditor({ business: b }: { business: Editable }) {
  const [state, onSubmit, pending] = useFormAction(updatePendingBusinessAction);
  const [type, setType] = useState(b.type);
  const e = state.errors ?? {};
  const f = (k: string) => `${k}-${b.id}`;
  const select = `${input} cursor-pointer`;

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 rounded-xl bg-brand-wash p-4 sm:grid-cols-2" noValidate>
      <input type="hidden" name="id" value={b.id} />
      <div className="sm:col-span-2">
        <label htmlFor={f("name")} className={label}>Business name</label>
        <input id={f("name")} name="name" defaultValue={b.name} className={input} aria-invalid={Boolean(e.name)} />
        <FieldError message={e.name} />
      </div>
      <div>
        <label htmlFor={f("type")} className={label}>Type</label>
        <select id={f("type")} name="type" value={type} onChange={(ev) => setType(ev.target.value as Editable["type"])} className={select}>
          <option value="PHYSICAL">Physical location</option>
          <option value="ONLINE">Online only</option>
        </select>
      </div>
      <div>
        <label htmlFor={f("category")} className={label}>Category</label>
        <select id={f("category")} name="category" defaultValue={b.category} className={select} aria-invalid={Boolean(e.category)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <FieldError message={e.category} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={f("description")} className={label}>Description</label>
        <textarea id={f("description")} name="description" rows={3} defaultValue={b.description} className={textarea} aria-invalid={Boolean(e.description)} />
        <FieldError message={e.description} />
      </div>
      {type === "PHYSICAL" && (
        <>
          <div className="sm:col-span-2">
            <label htmlFor={f("address")} className={label}>Address or landmark</label>
            <input id={f("address")} name="address" defaultValue={b.address ?? ""} className={input} aria-invalid={Boolean(e.address)} />
            <FieldError message={e.address} />
          </div>
          <div>
            <label htmlFor={f("city")} className={label}>Town / city</label>
            <input id={f("city")} name="city" defaultValue={b.city ?? ""} className={input} aria-invalid={Boolean(e.city)} />
            <FieldError message={e.city} />
          </div>
          <div>
            <label htmlFor={f("region")} className={label}>Region</label>
            <select id={f("region")} name="region" defaultValue={b.region ?? ""} className={select}>
              <option value="">No region</option>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </>
      )}
      <div>
        <label htmlFor={f("website")} className={label}>Website or social page</label>
        <input id={f("website")} name="website" type="url" defaultValue={b.website ?? ""} className={input} aria-invalid={Boolean(e.website)} />
        <FieldError message={e.website} />
      </div>
      <div>
        <label htmlFor={f("phone")} className={label}>Business phone</label>
        <input id={f("phone")} name="phone" type="tel" defaultValue={b.phone ?? ""} className={input} />
      </div>
      <div className="sm:col-span-2">
        <FormMessage ok={state.ok} message={state.errors?.form ?? (state.errors && !state.errors.form ? "Please fix the highlighted fields." : state.message)} />
      </div>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <button type="submit" name="intent" value="save" disabled={pending} className={btn.smOutline}>
          {pending ? "Saving…" : "Save changes"}
        </button>
        <button type="submit" name="intent" value="approve" disabled={pending} className={btn.smPrimary}>
          Save &amp; approve
        </button>
      </div>
    </form>
  );
}
