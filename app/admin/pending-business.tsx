import Link from "next/link";
import { BusinessEditor } from "@/app/admin/business-editor";
import { AlertIcon, ClockIcon, GlobeIcon, LocationIcon, PhoneIcon, ShieldCheckIcon, UserIcon } from "@/components/icons";
import { btn, card, input, label } from "@/components/ui";
import { approveBusinessAction, rejectBusinessAction } from "@/lib/actions/admin";
import { REJECTION_REASONS } from "@/lib/constants";
import { formatDate, timeAgo } from "@/lib/format";
import { formatGhanaPhone, normalizeGhanaPhone } from "@/lib/phone";
import type { getModerationQueue } from "@/lib/queries";

type Item = Awaited<ReturnType<typeof getModerationQueue>>[number];

const linkClass = "font-medium break-all text-brand underline underline-offset-2 hover:text-brand-hover";

export function PendingBusiness({ b }: { b: Item }) {
  const phoneE164 = b.phone ? normalizeGhanaPhone(b.phone) : null;
  const where = [b.address, b.city, b.region].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([b.name, b.address, b.city, "Ghana"].filter(Boolean).join(", "))}`;
  const s = b.submittedBy;
  const stats = b.submitterStats;

  return (
    <article className={`${card} p-5 sm:p-6`} aria-labelledby={`pb-${b.id}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Listing details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id={`pb-${b.id}`} className="font-display text-lg font-semibold">{b.name}</h3>
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand-deep">{b.category}</span>
            <span className="rounded-full border border-line-strong px-2.5 py-0.5 text-xs font-semibold text-ink">
              {b.type === "ONLINE" ? "Online" : "Physical"}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <ClockIcon size={14} />
            Submitted <time dateTime={b.createdAt.toISOString()} title={b.createdAt.toISOString()}>{timeAgo(b.createdAt)}</time>
            <span aria-hidden>·</span> {formatDate(b.createdAt)}
          </p>
          <p className="mt-3 text-body">{b.description}</p>

          <ul className="mt-3 space-y-1.5 text-sm">
            {b.website && (
              <li className="flex items-start gap-2">
                <GlobeIcon size={16} className="mt-0.5 shrink-0 text-muted" />
                <a href={b.website} target="_blank" rel="noopener noreferrer nofollow" className={linkClass}>
                  {b.website.replace(/^https?:\/\/(www\.)?/, "")} ↗
                </a>
              </li>
            )}
            {where && (
              <li className="flex items-start gap-2">
                <LocationIcon size={16} className="mt-0.5 shrink-0 text-muted" />
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {where} · Open in Maps ↗
                </a>
              </li>
            )}
            {b.phone && (
              <li className="flex items-start gap-2">
                <PhoneIcon size={16} className="mt-0.5 shrink-0 text-muted" />
                <a href={`tel:${phoneE164 ?? b.phone}`} className={linkClass}>{phoneE164 ? formatGhanaPhone(phoneE164) : b.phone}</a>
              </li>
            )}
          </ul>

          {b.duplicates.length > 0 && (
            <div role="note" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="flex items-center gap-2 font-semibold">
                <AlertIcon size={16} /> Possible duplicate{b.duplicates.length === 1 ? "" : "s"}
              </p>
              <ul className="mt-2 space-y-1">
                {b.duplicates.map((d) => (
                  <li key={d.id}>
                    {d.status === "APPROVED" ? (
                      <Link href={`/businesses/${d.slug}`} target="_blank" className="font-semibold underline">{d.name}</Link>
                    ) : (
                      <span className="font-semibold">{d.name}</span>
                    )}
                    {d.city && <> · {d.city}</>} · {d.status === "APPROVED" ? "already listed" : "also awaiting review"}
                    {d.reason === "same-website" && <> · <strong>same website/social page</strong></>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submitter + decision */}
        <div className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
          <div className="rounded-xl border border-line bg-brand-wash p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <UserIcon size={16} /> {s?.name ?? "Unknown user"}
            </p>
            {s && (
              <>
                <p className="mt-0.5 break-all text-muted">{s.email}</p>
                <p className="mt-2 text-muted">Joined {formatDate(s.createdAt)}</p>
                <p className={`mt-1 flex items-center gap-1.5 ${s.phoneVerifiedAt ? "text-cta" : "text-red-700"}`}>
                  <ShieldCheckIcon size={14} /> {s.phoneVerifiedAt ? "Phone verified" : "Phone not verified"}
                </p>
                <p className="mt-2 text-ink">
                  <span className="font-semibold">{stats.approved}</span> approved · <span className="font-semibold">{stats.rejected}</span> rejected ·{" "}
                  <span className="font-semibold">{stats.pending}</span> pending
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <form action={approveBusinessAction}>
              <input type="hidden" name="id" value={b.id} />
              <button className={btn.smPrimary}>Approve</button>
            </form>
          </div>

          <details className="group rounded-xl border border-line">
            <summary className="flex min-h-11 cursor-pointer list-none items-center px-4 text-sm font-semibold text-red-700 hover:bg-red-50">
              Reject…
            </summary>
            <form action={rejectBusinessAction} className="flex flex-col gap-3 border-t border-line p-4">
              <input type="hidden" name="id" value={b.id} />
              <div>
                <label htmlFor={`reason-${b.id}`} className={label}>Reason (shown to the submitter)</label>
                <select id={`reason-${b.id}`} name="reason" defaultValue={b.duplicates.some((d) => d.status === "APPROVED") ? REJECTION_REASONS[1] : REJECTION_REASONS[0]} className={`${input} h-11 cursor-pointer text-sm`}>
                  {REJECTION_REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor={`note-${b.id}`} className={label}>Note <span className="font-normal text-muted">(optional)</span></label>
                <input id={`note-${b.id}`} name="note" maxLength={300} placeholder="e.g. It's listed as Drezzup Sneakers" className={`${input} h-11 text-sm`} />
              </div>
              <button className={btn.smDanger}>Reject listing</button>
            </form>
          </details>
        </div>
      </div>

      <details className="mt-4 border-t border-line pt-3">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-lg px-1 text-sm font-semibold text-brand hover:text-brand-hover">
          Edit details before approving
        </summary>
        <BusinessEditor
          business={{
            id: b.id,
            name: b.name,
            type: b.type,
            category: b.category,
            description: b.description,
            address: b.address,
            city: b.city,
            region: b.region,
            website: b.website,
            phone: b.phone,
          }}
        />
      </details>
    </article>
  );
}
