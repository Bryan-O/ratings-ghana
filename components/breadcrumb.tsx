import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ crumbs, onDark = false }: { crumbs: Crumb[]; onDark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-sm font-medium ${onDark ? "text-white/75" : "text-muted"}`}>
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className={onDark ? "text-white/40" : "text-line-strong"}>/</span>}
            {c.href ? (
              <Link href={c.href} className={`inline-flex min-h-8 items-center rounded transition-colors duration-200 ${onDark ? "hover:text-white" : "hover:text-brand"}`}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={onDark ? "text-white" : "text-ink"}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
