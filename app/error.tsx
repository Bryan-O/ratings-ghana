"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";
import { LogoMark } from "@/components/icons";
import { btn } from "@/components/ui";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <LogoMark size={48} className="text-brand" />
      <h1 className="font-display text-3xl font-bold tracking-tight">Something went wrong.</h1>
      <p className="max-w-md text-muted">
        Sorry about that. Try again — and if the site was just updated, reloading the page usually fixes it.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className={btn.primary}>
          Try again
        </button>
        <button type="button" onClick={() => window.location.reload()} className={btn.outline}>
          Reload page
        </button>
        <Link href="/" className={btn.outline}>Go home</Link>
      </div>
      {error.digest && <p className="text-xs text-muted">Reference: {error.digest}</p>}
    </main>
  );
}
