"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/lib/actions/auth";
import { CloseIcon, MenuIcon } from "@/components/icons";

type Props = {
  links: { href: string; label: string }[];
  signedIn: boolean;
  userLabel?: string;
};

const item = "flex min-h-12 w-full cursor-pointer items-center rounded-xl px-4 text-base font-semibold text-ink transition-colors duration-200 hover:bg-brand-soft hover:text-brand";

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
        className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-white transition-colors duration-200 hover:bg-white/10"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-16 z-50 border-t border-white/10 bg-white p-4 shadow-xl">
          {userLabel && <p className="mb-2 truncate px-4 text-sm text-muted">Signed in as {userLabel}</p>}
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={item}>{l.label}</Link>
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
                <Link href="/login" className="flex h-12 items-center justify-center rounded-xl border-2 border-line-strong font-semibold text-ink">Login</Link>
                <Link href="/register" className="flex h-12 items-center justify-center rounded-xl bg-cta font-semibold text-white">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
