import { LocationIcon, SearchIcon } from "@/components/icons";

type Props = { q?: string; location?: string; className?: string; size?: "lg" | "md" };

/** Business name + location search. Submits to /businesses. */
export function SearchBar({ q = "", location = "", className = "", size = "md" }: Props) {
  const h = size === "lg" ? "sm:h-16" : "sm:h-14";
  return (
    <form
      action="/businesses"
      role="search"
      className={`flex w-full flex-col gap-2 rounded-2xl border border-line bg-white p-2 shadow-[0_8px_30px_-12px_rgba(76,29,149,0.25)] sm:flex-row sm:items-center sm:gap-0 ${className}`}
    >
      <div className={`flex h-12 flex-[1.3] items-center gap-2 px-3 ${h}`}>
        <SearchIcon size={20} className="shrink-0 text-brand" />
        <label className="sr-only" htmlFor="search-q">Business name</label>
        <input
          id="search-q"
          name="q"
          defaultValue={q}
          placeholder="Search waakye, salons, Jumia…"
          className="h-full w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-muted/80"
        />
      </div>
      <span aria-hidden className="hidden h-8 w-px bg-line-strong sm:block" />
      <div className={`flex h-12 flex-1 items-center gap-2 border-t border-line px-3 sm:border-t-0 ${h}`}>
        <LocationIcon size={20} className="shrink-0 text-brand" />
        <label className="sr-only" htmlFor="search-location">Location</label>
        <input
          id="search-location"
          name="location"
          defaultValue={location}
          placeholder="City or area"
          className="h-full w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-muted/80"
        />
      </div>
      <button
        type="submit"
        aria-label="Search"
        className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-cta px-6 font-semibold text-white transition-colors duration-200 hover:bg-cta-hover ${size === "lg" ? "sm:h-12" : "sm:h-10"}`}
      >
        <SearchIcon size={18} />
        <span>Search</span>
      </button>
    </form>
  );
}
