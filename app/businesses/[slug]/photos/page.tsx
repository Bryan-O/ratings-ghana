import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PlusIcon } from "@/components/icons";
import { btn, container } from "@/components/ui";
import { removePhotoAction } from "@/lib/actions/photos";
import { displayName } from "@/lib/format";
import { getApprovedPhotos, getBusinessBySlug } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBusinessBySlug((await params).slug);
  return b?.status === "APPROVED" ? { title: `Photos of ${b.name}` } : {};
}

export default async function BusinessPhotosPage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business || business.status !== "APPROVED") notFound();

  const [photos, user] = await Promise.all([getApprovedPhotos(business.id), getCurrentUser()]);
  const isAdmin = user?.role === "ADMIN";
  const byUrl = new Map(photos.map((p) => [p.url, p]));
  // Business.images is the display order; community photos carry credits, seed photos don't.
  const items = business.images.map((url) => ({ url, photo: byUrl.get(url) }));

  return (
    <>
      <SiteHeader
        title={`Photos of ${business.name}`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: business.name, href: `/businesses/${business.slug}` },
          { label: "Photos" },
        ]}
        subtitle={`${items.length} photo${items.length === 1 ? "" : "s"} shared by the RatingsGhana community`}
      >
        <Link href={`/businesses/${business.slug}#add-photos`} className={btn.cta}>
          <PlusIcon size={18} /> Add photos
        </Link>
      </SiteHeader>
      <main className={`${container} flex-1 py-10`}>
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line-strong bg-white p-10 text-center text-muted">
            No photos yet. Be the first to add one.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ url, photo }, i) => (
              <li key={url} className="overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-[4/3] bg-brand-soft">
                  <Image
                    src={url}
                    alt={photo?.caption ?? `${business.name} photo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0 text-sm">
                    {photo?.caption && <p className="font-semibold text-ink">{photo.caption}</p>}
                    <p className="text-muted">{photo ? `Photo by ${displayName(photo.uploader.name)}` : "Photo: RatingsGhana"}</p>
                  </div>
                  {isAdmin && photo && (
                    <form action={removePhotoAction}>
                      <input type="hidden" name="id" value={photo.id} />
                      <button type="submit" className={btn.smDanger}>Remove</button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
