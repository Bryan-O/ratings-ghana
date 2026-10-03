import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { BusinessCard } from "@/components/business-card";
import { SearchBar } from "@/components/search-bar";
import { CATEGORIES } from "@/lib/constants";
import { searchBusinesses } from "@/lib/queries";

export const metadata: Metadata = { title: "Businesses" };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

export default async function BusinessesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = one(sp.q);
  const location = one(sp.location);
  const category = CATEGORIES.find((c) => c === one(sp.category));
  const typeParam = one(sp.type);
  const type = typeParam === "ONLINE" || typeParam === "PHYSICAL" ? typeParam : undefined;
  const page = Math.max(1, Number.parseInt(one(sp.page) ?? "1", 10) || 1);

  const { items, total, pageCount } = await searchBusinesses({ q, location, category, type, page });

  const qs = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, location, category, type, ...overrides };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/businesses?${s}` : "/businesses";
  };

  const title = category ?? (q ? `Results for “${q}”` : "Businesses");
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm font-medium whitespace-nowrap ${active ? "border-ink bg-ink text-white" : "border-ink text-ink hover:bg-black/5"}`;

  return (
    <>
      <SiteHeader title={title} crumbs={[{ label: "Home", href: "/" }, { label: "Businesses", href: "/businesses" }]} />
      <main className="mx-auto w-full max-w-[1512px] flex-1 px-4 py-8 lg:px-[34px]">
        <div className="flex flex-col gap-5">
          <SearchBar q={q} location={location} />
          <div className="flex flex-wrap items-center gap-2" aria-label="Filters">
            <Link href={qs({ type: undefined })} className={chip(!type)}>All</Link>
            <Link href={qs({ type: "PHYSICAL" })} className={chip(type === "PHYSICAL")}>Physical</Link>
            <Link href={qs({ type: "ONLINE" })} className={chip(type === "ONLINE")}>Online</Link>
            <span className="mx-1 h-5 w-px bg-hairline" aria-hidden />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => (
                <Link key={c} href={qs({ category: category === c ? undefined : c, page: undefined })} className={chip(category === c)}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted" aria-live="polite">
            {total} {total === 1 ? "business" : "businesses"}
            {location ? ` in “${location}”` : ""}
          </p>
        </div>

        {items.length > 0 ? (
          <ul className="mt-6 grid grid-cols-1 gap-x-[43px] gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((b) => (
              <li key={b.id}>
                <BusinessCard business={b} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold">No businesses found.</p>
            <p className="mt-2 text-muted">
              Can&apos;t find it?{" "}
              <Link href="/businesses/new" className="font-semibold text-ink underline">
                Add a business
              </Link>{" "}
              and we&apos;ll review it.
            </p>
          </div>
        )}

        {pageCount > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-4">
            {page > 1 && <Link href={qs({ page: String(page - 1) })} className="font-semibold underline">Previous</Link>}
            <span className="text-sm text-muted">Page {page} of {pageCount}</span>
            {page < pageCount && <Link href={qs({ page: String(page + 1) })} className="font-semibold underline">Next</Link>}
          </nav>
        )}
      </main>
    </>
  );
}
