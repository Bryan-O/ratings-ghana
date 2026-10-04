"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { btn } from "@/components/ui";

type Props = {
  links: { href: string; label: string; matchable?: boolean }[];
  signedIn: boolean;
  userLabel?: string;
};

const item = "flex min-h-12 w-full cursor-pointer items-center rounded-xl px-4 text-base font-medium text-ink transition-colors duration-200 hover:bg-brand-wash aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand";

export function MobileMenu({ links, signedIn, userLabel }: Props) {
  const pathname = usePathname();
  // Remember which page the menu was opened on so it closes after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpenOn(open ? null : pathname)}
        className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-ink transition-colors duration-200 hover:bg-brand-wash"
      >
        <span key={String(open)} className="animate-pop">{open ? <CloseIcon /> : <MenuIcon />}</span>
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-16 z-50 animate-drop border-y border-line bg-paper p-4">
          {userLabel && <p className="mb-2 truncate px-4 text-sm text-muted">Signed in as {userLabel}</p>}
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} aria-current={l.matchable !== false && pathname === l.href ? "page" : undefined} className={item}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-line pt-3">
            {signedIn ? (
              <form action={signOutAction}>
                <button type="submit" className={item}>Sign out</button>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className={btn.outline}>Log in</Link>
                <Link href="/register" className={btn.cta}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
