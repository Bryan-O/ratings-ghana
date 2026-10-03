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

export function MobileMenu({ links, signedIn, userLabel }: Props) {
  const pathname = usePathname();
  // Remember which page the menu was opened on so it closes after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpenOn(open ? null : pathname)}
        className="flex size-10 items-center justify-center"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      {open && (
        <div
          id="mobile-menu"
          className="absolute top-12 right-0 z-50 w-56 rounded-lg bg-white p-5 text-ink shadow-xl ring-1 ring-black/5"
        >
          {userLabel && <p className="mb-3 truncate text-sm text-muted">{userLabel}</p>}
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="block text-base font-bold">
                  {l.label}
                </Link>
              </li>
            ))}
            {signedIn ? (
              <li>
                <form action={signOutAction}>
                  <button type="submit" className="text-base font-bold">
                    Sign out
                  </button>
                </form>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/register" className="block text-base font-bold">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="block text-base font-bold">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
