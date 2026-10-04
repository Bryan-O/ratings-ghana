"use client";

import { useEffect, useState } from "react";
import { CheckIcon, ShareIcon } from "@/components/icons";
import { btn } from "@/components/ui";

/** Shares the page with the phone's share sheet, or copies the link where that isn't available. */
export function ShareButton({ title, className = "" }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function share() {
    const url = window.location.href.split("#")[0];
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`${btn.outline} px-5 ${className}`}
    >
      {copied ? <CheckIcon size={18} className="animate-pop" /> : <ShareIcon size={18} />}
      <span>{copied ? "Link copied" : "Share"}</span>
      <span className="sr-only" aria-live="polite">{copied ? "Link copied to clipboard" : ""}</span>
    </button>
  );
}
