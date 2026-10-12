import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";
import { countMySubmissions } from "@/lib/queries";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";
import { Breadcrumb, type Crumb } from "@/components/breadcrumb";
import { MobileMenu } from "@/components/mobile-menu";
import { LogoMark, ShieldCheckIcon } from "@/components/icons";
import { AutoHideHeader } from "@/components/auto-hide-header";
import { HeaderSearch } from "@/components/header-search";
import { NavLink } from "@/components/nav-link";
import { btn, container } from "@/components/ui";

type Props = {
  /** Inner pages get a title band with a breadcrumb under the top bar. */
  title?: string;
  subtitle?: React.ReactNode;
  crumbs?: Crumb[];
  /** Extra content inside the title band (e.g. a search bar). */
  children?: React.ReactNode;
  /** Show the compact search in the top bar (off on the home page, which leads with its own). */
  search?: boolean;
};

// Ink top bar, Trustpilot-style: logo, (search), plain white links, then one pill action.
const navLink =
  "inline-flex h-11 items-center rounded-lg px-3 text-[15px] font-medium whitespace-nowrap text-white/85 transition-colors duration-200 hover:text-white aria-[current=page]:text-white";

export async function SiteHeader({ title, subtitle, crumbs, children, search = true }: Props) {
  const user = await getCurrentUser();
  const step = nextVerificationStep(user);

  const submissions = user ? await countMySubmissions(user.id) : 0;

  const links = [
    { href: "/businesses", label: "Write a review", matchable: false },
    { href: "/businesses", label: "Businesses", exclude: ["/businesses/new"] },
    ...(user ? [{ href: "/businesses/new", label: "Add a business" }] : []),
    ...(submissions > 0 ? [{ href: "/my-submissions", label: "My submissions" }] : []),
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      <AutoHideHeader className="bg-ink">
        <div className={`${container} flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]`}>
          <Link href="/" className="group flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg text-white">
            <LogoMark className="text-white" mono bg="#16161a" />
            <span className="font-display text-xl font-bold tracking-[-0.01em]">RatingsGhana</span>
          </Link>

          {search && <HeaderSearch className="hidden max-w-md min-w-0 flex-1 xl:block" />}

          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {links.map((l) => (
              <NavLink key={l.label} href={l.href} matchable={l.matchable !== false} exclude={l.exclude} className={navLink}>
                {l.label}
              </NavLink>
            ))}
            <div className="ml-2 flex items-center gap-2">
              {user ? (
                <>
                  <span className="max-w-36 truncate px-2 text-sm font-medium text-white/70" title={user.email}>
                    {user.name ?? user.email}
                  </span>
                  <form action={signOutAction}>
                    <button type="submit" className={btn.smOnDark}>
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <NavLink href="/login" className={navLink}>
                    Log in
                  </NavLink>
                  <Link href="/register" className={btn.smCoral}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>

          <MobileMenu links={links} signedIn={Boolean(user)} userLabel={user?.name ?? user?.email ?? undefined} />
        </div>
      </AutoHideHeader>

      {user && step === "verify-phone" && (
        <div className="bg-brand px-4 py-1 text-center text-sm text-white sm:py-2.5">
          <ShieldCheckIcon size={16} className="mr-1.5 inline -mt-0.5" />
          Prove you&rsquo;re a real person to start reviewing.{" "}
          <Link href="/verify-phone" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2 transition-colors duration-200 hover:text-coral sm:min-h-0">
            Verify your phone
          </Link>
        </div>
      )}

      {title && (
        <div className="border-b border-line bg-brand-wash">
          <div className={`${container} py-8 lg:py-10`}>
            {crumbs && <Breadcrumb crumbs={crumbs} />}
            <h1 className="mt-2 font-display text-[1.875rem] leading-tight font-extrabold tracking-[-0.02em] lg:text-[2.5rem]">{title}</h1>
            {subtitle && <div className="mt-2 text-muted">{subtitle}</div>}
            {children && <div className="mt-6">{children}</div>}
          </div>
        </div>
      )}
    </>
  );
}
