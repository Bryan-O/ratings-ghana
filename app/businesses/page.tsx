import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BusinessCard } from "@/components/business-card";
import { SearchBar } from "@/components/search-bar";
import { CategoryIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { btn, container } from "@/components/ui";
import { CATEGORIES } from "@/lib/constants";
import { getCategoryCounts, searchBusinesses } from "@/lib/queries";

export const metadata: Metadata = { title: "Businesses" };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

const filterLink = (active: boolean) =>
  `flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors duration-200 ${
    active ? "bg-brand text-white" : "bg-white text-ink ring-1 ring-line hover:text-brand hover:ring-brand lg:bg-transparent lg:ring-0 lg:hover:bg-brand-soft"
  }`;

export default async function BusinessesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = one(sp.q);
  const location = one(sp.location);
  const category = CATEGORIES.find((c) => c === one(sp.category));
  const typeParam = one(sp.type);
  const type = typeParam === "ONLINE" || typeParam === "PHYSICAL" ? typeParam : undefined;
  const page = Math.max(1, Number.parseInt(one(sp.page) ?? "1", 10) || 1);

  const [{ items, total, pageCount }, counts] = await Promise.all([
    searchBusinesses({ q, location, category, type, page }),
    getCategoryCounts(),
  ]);

  const qs = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, location, category, type, ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/businesses?${s}` : "/businesses";
  };

  const title = category ?? (q ? `Results for “${q}”` : "Businesses in Ghana");

  return (
    <>
      <SiteHeader
        title={title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Businesses", href: "/businesses" }]}
        subtitle={
          <span aria-live="polite">
            {total} {total === 1 ? "business" : "businesses"}
            {location ? ` in “${location}”` : ""} · rated by phone-verified reviewers
          </span>
        }
      >
        <SearchBar q={q} location={location} className="max-w-3xl" />
      </SiteHeader>

      <main className={`${container} flex-1 py-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 lg:py-10`}>
        <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="sr-only lg:not-sr-only lg:mb-2 lg:px-3 lg:font-display lg:text-sm lg:font-semibold lg:tracking-wide lg:text-muted lg:uppercase">Type</h2>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
            <Link href={qs({ type: undefined, page: undefined })} className={filterLink(!type)}>All</Link>
            <Link href={qs({ type: "PHYSICAL", page: undefined })} className={filterLink(type === "PHYSICAL")}>Physical</Link>
            <Link href={qs({ type: "ONLINE", page: undefined })} className={filterLink(type === "ONLINE")}>Online</Link>
          </div>
          <h2 className="sr-only lg:not-sr-only lg:mt-6 lg:mb-2 lg:px-3 lg:font-display lg:text-sm lg:font-semibold lg:tracking-wide lg:text-muted lg:uppercase">Category</h2>
          <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:mt-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
            {CATEGORIES.map((c) => (
              <Link key={c} href={qs({ category: category === c ? undefined : c, page: undefined })} className={filterLink(category === c)} aria-current={category === c ? "true" : undefined}>
                <CategoryIcon category={c} size={18} className="hidden lg:block" />
                <span className="flex-1">{c}</span>
                <span className={`hidden text-xs lg:inline ${category === c ? "text-white/80" : "text-muted"}`}>{counts.get(c) ?? 0}</span>
              </Link>
            ))}
          </div>
        </aside>

        <section className="mt-6 lg:mt-0" aria-label="Results">
          {items.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((b) => (
                <li key={b.id}>
                  <BusinessCard business={b} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line-strong bg-white px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <SearchIcon size={26} />
              </span>
              <p className="mt-5 font-display text-xl font-semibold text-ink">No businesses found.</p>
              <p className="mt-2 max-w-md text-muted">Try a different search or location — or add the business so others can review it.</p>
              <Link href="/businesses/new" className={`${btn.cta} mt-6`}>
                <PlusIcon size={18} /> Add a business
              </Link>
            </div>
          )}

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
              {page > 1 && <Link href={qs({ page: String(page - 1) })} className={btn.smOutline}>Previous</Link>}
              <span className="text-sm text-muted">Page {page} of {pageCount}</span>
              {page < pageCount && <Link href={qs({ page: String(page + 1) })} className={btn.smOutline}>Next</Link>}
            </nav>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
