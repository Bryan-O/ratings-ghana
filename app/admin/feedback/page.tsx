import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CheckIcon, ClockIcon, MessageIcon } from "@/components/icons";
import { btn, card, container } from "@/components/ui";
import { setFeedbackStatusAction } from "@/lib/actions/feedback";
import { formatDate, timeAgo } from "@/lib/format";
import { getFeedback, getFeedbackCounts } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { describeUserAgent } from "@/lib/user-agent";

export const metadata: Metadata = { title: "Tester feedback" };
export const dynamic = "force-dynamic";

const TYPE_LABEL = {
  BUG: { text: "Bug", className: "bg-coral-soft text-coral-ink" },
  CONFUSING: { text: "Confusing", className: "bg-coral-tint text-ink" },
  IDEA: { text: "Idea", className: "bg-cta-soft text-ok-ink" },
  OTHER: { text: "Other", className: "bg-brand-soft text-brand" },
} as const;

type Filter = "NEW" | "RESOLVED" | "ALL";

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") notFound();

  const { status } = await searchParams;
  const filter: Filter = status === "RESOLVED" || status === "ALL" ? status : "NEW";
  const [items, counts] = await Promise.all([getFeedback(filter), getFeedbackCounts()]);

  const tab = (f: Filter, text: string) => (
    <Link
      href={f === "NEW" ? "/admin/feedback" : `/admin/feedback?status=${f}`}
      aria-current={filter === f ? "page" : undefined}
      className={`inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold transition-colors duration-200 ${
        filter === f ? "bg-brand text-white" : "bg-paper text-ink ring-1 ring-line hover:text-brand hover:ring-brand"
      }`}
    >
      {text} ({counts[f]})
    </Link>
  );

  return (
    <>
      <SiteHeader
        title="Tester feedback"
        crumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }]}
        subtitle="Messages sent with the Feedback button, newest first."
      >
        <div className="flex flex-wrap items-center gap-2">
          {tab("NEW", "New")}
          {tab("RESOLVED", "Resolved")}
          {tab("ALL", "All")}
          <a href="/admin/feedback/export" className={`${btn.smOutline} ml-auto h-11`} download>
            Download CSV
          </a>
        </div>
      </SiteHeader>
      <main className={`${container} flex-1 py-10`}>
        {items.length === 0 ? (
          <div className={`${card} flex flex-col items-center p-10 text-center`}>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand"><MessageIcon size={26} /></span>
            <p className="mt-4 font-display text-lg font-semibold text-ink">
              {filter === "NEW" ? "No new feedback." : "Nothing here yet."}
            </p>
            <p className="mt-1 text-muted">Feedback from testers will appear here as soon as it&apos;s sent.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((f) => {
              const t = TYPE_LABEL[f.type];
              const who = f.user ? `${f.user.name ?? "User"} (${f.user.email})` : f.email ? f.email : "Anonymous";
              return (
                <li key={f.id}>
                  <article className={`${card} flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${t.className}`}>{t.text}</span>
                        <span className="inline-flex items-center gap-1 text-muted">
                          <ClockIcon size={14} />
                          <time dateTime={f.createdAt.toISOString()} title={formatDate(f.createdAt)}>{timeAgo(f.createdAt)}</time>
                        </span>
                        {f.status === "RESOLVED" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cta-soft px-2.5 py-0.5 text-xs font-semibold text-ok-ink">
                            <CheckIcon size={12} /> Resolved
                          </span>
                        )}
                      </div>
                      <p className="mt-3 whitespace-pre-line text-ink">{f.message}</p>
                      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm text-muted sm:grid-cols-[auto_1fr]">
                        <dt className="font-semibold text-body">Page</dt>
                        <dd className="break-all">
                          <Link href={f.path} className="text-brand underline underline-offset-2 hover:text-ink">{f.path}</Link>
                        </dd>
                        <dt className="font-semibold text-body">From</dt>
                        <dd className="break-all">{who}</dd>
                        <dt className="font-semibold text-body">Device</dt>
                        <dd>
                          {describeUserAgent(f.userAgent)}
                          {f.viewport && <> · screen {f.viewport}</>}
                        </dd>
                      </dl>
                    </div>
                    <form action={setFeedbackStatusAction} className="shrink-0">
                      <input type="hidden" name="id" value={f.id} />
                      <input type="hidden" name="status" value={f.status === "NEW" ? "RESOLVED" : "NEW"} />
                      <button className={f.status === "NEW" ? btn.smPrimary : btn.smOutline}>
                        {f.status === "NEW" ? "Mark resolved" : "Reopen"}
                      </button>
                    </form>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
