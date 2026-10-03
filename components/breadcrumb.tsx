import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-muted">
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="text-line-strong">/</span>}
            {c.href ? (
              <Link href={c.href} className="rounded transition-colors duration-200 hover:text-brand">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
