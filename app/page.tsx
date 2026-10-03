import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SearchBar } from "@/components/search-bar";
import { BusinessImage } from "@/components/business-image";
import { ChevronDownIcon } from "@/components/icons";
import { getPopularBusinesses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const popular = await getPopularBusinesses(7);
  const chips = popular.slice(0, 3);
  const collage = popular.slice(0, 4);
  // Figma collage: wide/narrow on the first row, narrow/wide on the second.
  const widths = ["sm:w-[351px]", "sm:w-[206px]", "sm:w-[206px]", "sm:w-[351px]"];

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(0deg,rgba(255,255,255,0.77),rgba(255,255,255,0.77)),linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2))]">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-[1512px] flex-1 grid-cols-1 content-start gap-10 px-4 pt-6 pb-16 lg:grid-cols-[minmax(0,640px)_1fr] lg:gap-14 lg:px-[52px] lg:pt-12">
        <section className="flex flex-col lg:pt-6">
          <h1 className="text-[28px] leading-tight font-extrabold text-ink-strong lg:text-[32px]">
            Empowering you to make
            <br />
            informed choices.
          </h1>
          <p className="mt-2 max-w-[460px] text-base text-muted lg:text-xl">
            A safe space to give reviews and recommendations of businesses in Ghana
          </p>
          {/* Mobile design puts search above the headline; desktop puts it below. */}
          <SearchBar className="order-first mb-8 lg:order-none lg:mt-9 lg:mb-0" />
          {chips.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3" aria-label="Popular businesses">
              {chips.map((b) => (
                <li key={b.id}>
                  <Link href={`/businesses/${b.slug}`} className="flex h-[29px] items-center gap-1 px-2.5 text-base font-bold text-ink hover:underline">
                    {b.name} <ChevronDownIcon className="-rotate-90" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/businesses" className="flex h-[29px] items-center gap-1 px-2.5 text-base font-bold text-ink hover:underline">
                  More <ChevronDownIcon />
                </Link>
              </li>
            </ul>
          )}
          <p className="mt-10 max-w-[520px] text-sm text-muted">
            Every reviewer on RatingsGhana verifies their email and a Ghana phone number, and can review each business only once — so
            the ratings you see come from real people.
          </p>
        </section>

        {collage.length > 0 && (
          <section aria-label="Featured businesses" className="grid grid-cols-2 content-start gap-4 self-start sm:flex sm:flex-wrap sm:gap-x-[35px] sm:gap-y-[19px] lg:max-w-[592px]">
            {collage.map((b, i) => (
              <Link
                key={b.id}
                href={`/businesses/${b.slug}`}
                className={`group relative h-[150px] overflow-hidden rounded-[20px] bg-btn sm:h-[208px] ${widths[i]}`}
              >
                <BusinessImage src={b.images[0]} name={b.name} sizes="351px" className="rounded-[20px]" priority={i < 2} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  {b.name}
                </span>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
