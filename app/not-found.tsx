import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <LogoMark size={48} className="text-brand" />
      <p className="font-display text-6xl font-bold text-coral">404</p>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">We couldn&apos;t find that page.</h1>
      <p className="max-w-md text-muted">The business may have moved, or the link is wrong.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/businesses" className={btn.primary}>Browse businesses</Link>
        <Link href="/" className={btn.outline}>Go home</Link>
      </div>
    </main>
  );
}
