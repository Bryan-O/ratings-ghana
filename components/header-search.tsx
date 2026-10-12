import { SearchIcon } from "@/components/icons";

/** Compact search in the ink top bar on inner pages (a plain GET form, like the main search). */
export function HeaderSearch({ className = "" }: { className?: string }) {
  return (
    <form action="/businesses" role="search" className={`relative w-full ${className}`}>
      <label htmlFor="header-q" className="sr-only">Search for a business</label>
      <SearchIcon size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
      <input
        id="header-q"
        name="q"
        type="search"
        placeholder="Search for another business…"
        className="h-11 w-full rounded-lg border border-transparent bg-paper pr-4 pl-10 text-[15px] text-ink outline-none transition-[box-shadow] duration-200 placeholder:text-muted focus:ring-4 focus:ring-brand-light/50"
      />
    </form>
  );
}
