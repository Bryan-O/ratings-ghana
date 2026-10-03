import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-semibold tracking-wide text-muted">RATINGS GHANA</p>
      <h1 className="text-3xl font-extrabold text-ink-strong">We couldn&apos;t find that page.</h1>
      <Link href="/businesses" className="rounded-[4px] bg-btn px-6 py-3 font-bold text-white">Browse businesses</Link>
    </main>
  );
}
