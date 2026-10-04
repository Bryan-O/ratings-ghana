"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryIcon, LocationIcon, SearchIcon } from "@/components/icons";
import { CATEGORIES } from "@/lib/constants";

type Props = { q?: string; location?: string; className?: string; size?: "lg" | "md" };

type Suggestion = { label: string; hint: string; href: string; category: string };

const ALL: Suggestion[] = CATEGORIES.filter((c) => c !== "Other").map((c) => ({
  label: c,
  hint: "Category",
  href: `/businesses?category=${encodeURIComponent(c)}`,
  category: c,
}));

/**
 * Business name + location search. A plain GET form to /businesses, so it works without JavaScript.
 * With JavaScript, the name field also suggests matching categories (arrow keys, Enter, Escape).
 */
export function SearchBar({ q = "", location = "", className = "", size = "md" }: Props) {
  const router = useRouter();
  const listId = useId();
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [text, setText] = useState(q);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const term = text.trim().toLowerCase();
  const matches = (term ? ALL.filter((s) => s.label.toLowerCase().includes(term)) : ALL).slice(0, 6);
  const showList = open && matches.length > 0;
  const h = size === "lg" ? "sm:h-16" : "sm:h-14";

  function choose(s: Suggestion) {
    setOpen(false);
    router.push(s.href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (e.key === "Enter" && showList && active >= 0) {
      e.preventDefault();
      choose(matches[active]);
    }
  }

  return (
    <form
      action="/businesses"
      role="search"
      className={`relative flex w-full flex-col gap-2 rounded-2xl border-2 border-ink bg-paper p-2 transition-[box-shadow] duration-200 focus-within:ring-4 focus-within:ring-brand/20 sm:flex-row sm:items-center sm:gap-0 ${className}`}
    >
      <div className={`flex h-12 flex-[1.3] items-center gap-2 px-3 ${h}`}>
        <SearchIcon size={20} className="shrink-0 text-brand" />
        <label className="sr-only" htmlFor={`${listId}-q`}>Business name</label>
        <input
          id={`${listId}-q`}
          name="q"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            clearTimeout(blurTimer.current);
            setOpen(true);
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          placeholder="Search waakye, salons, Jumia…"
          className="h-full w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
      </div>
      <span aria-hidden className="hidden h-8 w-px bg-line-strong sm:block" />
      <div className={`flex h-12 flex-1 items-center gap-2 border-t border-line px-3 sm:border-t-0 ${h}`}>
        <LocationIcon size={20} className="shrink-0 text-brand" />
        <label className="sr-only" htmlFor={`${listId}-loc`}>Location</label>
        <input
          id={`${listId}-loc`}
          name="location"
          defaultValue={location}
          placeholder="City or area"
          className="h-full w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
      </div>
      <button
        type="submit"
        aria-label="Search"
        className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-cta px-6 font-semibold text-white transition-colors duration-200 hover:bg-cta-hover hover:text-ink active:translate-y-px ${
          size === "lg" ? "sm:h-12" : "sm:h-10"
        }`}
      >
        <SearchIcon size={18} />
        <span>Search</span>
      </button>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 animate-drop overflow-hidden rounded-2xl border border-line bg-paper p-1.5"
        >
          {matches.map((s, i) => (
            <li
              key={s.label}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(s)}
              onMouseEnter={() => setActive(i)}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-ink aria-selected:bg-brand-wash"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-wash text-ink">
                <CategoryIcon category={s.category} size={18} />
              </span>
              <span className="font-medium">{s.label}</span>
              <span className="ml-auto text-sm text-muted">{s.hint}</span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
