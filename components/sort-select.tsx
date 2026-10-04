"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDownIcon } from "@/components/icons";

type Option = { value: string; label: string; href: string };

/** Sort picker that navigates as soon as you change it (the list dims while the new order loads). */
export function SortSelect({ options, value }: { options: Option[]; value: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <label className="relative inline-flex items-center gap-2 text-sm text-muted">
      <span className="shrink-0">Sort by</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => {
            const next = options.find((o) => o.value === e.target.value);
            if (next) startTransition(() => router.push(next.href, { scroll: false }));
          }}
          aria-busy={pending}
          className="h-11 cursor-pointer appearance-none rounded-xl border border-line-strong bg-paper py-0 pr-10 pl-3 font-semibold text-ink transition-[border-color,box-shadow] duration-200 hover:border-ink/60 focus:border-brand focus:ring-4 focus:ring-brand/20 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon size={18} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink" />
      </span>
      {pending && <span className="size-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand" aria-label="Loading" />}
    </label>
  );
}
