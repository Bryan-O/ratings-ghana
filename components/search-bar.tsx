import { SearchIcon } from "@/components/icons";

/** Figma search field: business name | location | black search button. Submits to /businesses. */
export function SearchBar({ q = "", location = "", className = "" }: { q?: string; location?: string; className?: string }) {
  return (
    <form
      action="/businesses"
      role="search"
      className={`flex h-12 w-full max-w-[629px] items-center rounded-[4px] border-2 border-btn bg-white pr-[7px] ${className}`}
    >
      <label className="sr-only" htmlFor="search-q">Business name</label>
      <input
        id="search-q"
        name="q"
        defaultValue={q}
        placeholder="Search business name"
        className="h-full min-w-0 flex-[1.2] bg-transparent px-4 text-base outline-none placeholder:text-placeholder"
      />
      <span aria-hidden className="h-[30px] w-0.5 shrink-0 bg-[#d9d9d9]" />
      <label className="sr-only" htmlFor="search-location">Location</label>
      <input
        id="search-location"
        name="location"
        defaultValue={location}
        placeholder="Location"
        className="h-full min-w-0 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-placeholder"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex size-[33px] shrink-0 items-center justify-center rounded-[4px] border border-black/50 bg-[#040404] text-white hover:bg-btn"
      >
        <SearchIcon />
      </button>
    </form>
  );
}
