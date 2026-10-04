import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BusinessCard } from "@/components/business-card";
import { SearchBar } from "@/components/search-bar";
import { CategoryIcon, PlusIcon } from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { btn, container, press } from "@/components/ui";
import { BUSINESS_SORTS, CATEGORIES, PAGE_SIZE, type BusinessSort } from "@/lib/constants";
import { SortSelect } from "@/components/sort-select";
import { Rail } from "@/components/rail";
import { Reveal } from "@/components/reveal";
import { getCategoryCounts, searchBusinesses } from "@/lib/queries";

export const metadata: Metadata = { title: "Businesses" };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

// Filters: a swipe row on phones and tablets, a vertical list in the desktop sidebar.
const railClass = "-mx-4 gap-2 px-4 pt-1 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0";

const filterLink = (active: boolean) =>
  `flex min-h-11 shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[15px] font-medium whitespace-nowrap ${press} ${
    active ? "bg-ink text-white" : "bg-paper text-ink ring-1 ring-line-strong hover:ring-ink lg:bg-transparent lg:ring-0 lg:hover:bg-brand-wash"
  }`;

export default async function BusinessesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = one(sp.q);
  const location = one(sp.location);
  const category = CATEGORIES.find((c) => c === one(sp.category));
  const typeParam = one(sp.type);
  const type = typeParam === "ONLINE" || typeParam === "PHYSICAL" ? typeParam : undefined;
  const sortParam = one(sp.sort);
  const sort: BusinessSort = BUSINESS_SORTS.find((s) => s.value === sortParam)?.value ?? "popular";
  const page = Math.max(1, Number.parseInt(one(sp.page) ?? "1", 10) || 1);

  const [{ items, total, pageCount }, counts] = await Promise.all([
    searchBusinesses({ q, location, category, type, sort, page }),
    getCategoryCounts(),
  ]);

  const qs = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, location, category, type, sort: sort === "popular" ? undefined : sort, ...overrides };
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
            {location ? ` in “${location}”` : ""} · rated by verified reviewers
          </span>
        }
      >
        <SearchBar q={q} location={location} className="max-w-3xl" />
      </SiteHeader>

      <main className={`${container} flex-1 py-8 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:py-10`}>
        <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="sr-only lg:not-sr-only lg:mb-2 lg:px-3 lg:text-xs lg:font-semibold lg:tracking-[0.08em] lg:text-muted lg:uppercase">Type</h2>
          <Rail label="Business type" arrows={false} className={railClass}>
            <li className="snap-start"><Link href={qs({ type: undefined, page: undefined })} className={filterLink(!type)}>All</Link></li>
            <li className="snap-start"><Link href={qs({ type: "PHYSICAL", page: undefined })} className={filterLink(type === "PHYSICAL")}>Physical</Link></li>
            <li className="snap-start"><Link href={qs({ type: "ONLINE", page: undefined })} className={filterLink(type === "ONLINE")}>Online</Link></li>
          </Rail>
          <h2 className="sr-only lg:not-sr-only lg:mt-6 lg:mb-2 lg:px-3 lg:text-xs lg:font-semibold lg:tracking-[0.08em] lg:text-muted lg:uppercase">Category</h2>
          <div className="mt-2 lg:mt-0">
          <Rail label="Categories" arrows={false} className={railClass}>
            {CATEGORIES.map((c) => (
              <li key={c} className="snap-start"><Link href={qs({ category: category === c ? undefined : c, page: undefined })} className={filterLink(category === c)} aria-current={category === c ? "page" : undefined}>
                <CategoryIcon category={c} size={18} className="hidden lg:block" />
                <span className="flex-1">{c}</span>
                <span className={`hidden text-xs lg:inline ${category === c ? "text-white/80" : "text-muted"}`}>{counts.get(c) ?? 0}</span>
              </Link></li>
            ))}
          </Rail>
          </div>
        </aside>

        <section className="mt-6 lg:mt-0" aria-label="Results">
          {items.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                Showing <span className="font-semibold text-ink">{(page - 1) * PAGE_SIZE + 1}–{(page - 1) * PAGE_SIZE + items.length}</span> of{" "}
                <span className="font-semibold text-ink">{total}</span>
              </p>
              <SortSelect
                value={sort}
                options={BUSINESS_SORTS.map((o) => ({
                  value: o.value,
                  label: o.label,
                  href: qs({ sort: o.value === "popular" ? undefined : o.value, page: undefined }),
                }))}
              />
            </div>
          )}
          {items.length > 0 ? (
            <Reveal as="ul" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((b) => (
                <li key={b.id}>
                  <BusinessCard business={b} />
                </li>
              ))}
            </Reveal>
          ) : (
            <EmptyState title="Nothing matched that search." text="Try a shorter name, a different spelling, or browse by category. Not listed yet? Add it so others can rate it.">
              <Link href="/businesses/new" className={btn.cta}>
                <PlusIcon size={18} /> Add a business
              </Link>
            </EmptyState>
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
