import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";
import { countMySubmissions } from "@/lib/queries";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";
import { Breadcrumb, type Crumb } from "@/components/breadcrumb";
import { MobileMenu } from "@/components/mobile-menu";
import { LogoMark, ShieldCheckIcon } from "@/components/icons";
import { AutoHideHeader } from "@/components/auto-hide-header";
import { NavLink } from "@/components/nav-link";
import { btn, container } from "@/components/ui";

type Props = {
  /** Inner pages get a title band with a breadcrumb under the top bar. */
  title?: string;
  subtitle?: React.ReactNode;
  crumbs?: Crumb[];
  /** Extra content inside the title band (e.g. a search bar). */
  children?: React.ReactNode;
};

const navLink =
  "inline-flex h-11 items-center rounded-lg px-3 text-[15px] font-medium text-ink transition-colors duration-200 hover:text-brand aria-[current=page]:text-brand";

export async function SiteHeader({ title, subtitle, crumbs, children }: Props) {
  const user = await getCurrentUser();
  const step = nextVerificationStep(user);

  const submissions = user ? await countMySubmissions(user.id) : 0;

  const links = [
    { href: "/businesses", label: "Businesses", exclude: ["/businesses/new"] },
    { href: "/businesses", label: "Rate a business", matchable: false },
    ...(user ? [{ href: "/businesses/new", label: "Add a business" }] : []),
    ...(submissions > 0 ? [{ href: "/my-submissions", label: "My submissions" }] : []),
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      <AutoHideHeader className="border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className={`${container} flex h-16 items-center justify-between gap-4`}>
          <Link href="/" className="group flex min-h-11 items-center gap-2.5 rounded-lg text-ink">
            <LogoMark className="text-ink" />
            <span className="font-display text-xl font-bold tracking-tight">RatingsGhana</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink key={l.label} href={l.href} matchable={l.matchable !== false} exclude={l.exclude} className={navLink}>
                {l.label}
              </NavLink>
            ))}
            <div className="ml-3 flex items-center gap-2 border-l border-line pl-4">
              {user ? (
                <>
                  <span className="max-w-40 truncate text-sm font-medium text-muted" title={user.email}>
                    {user.name ?? user.email}
                  </span>
                  <form action={signOutAction}>
                    <button type="submit" className={btn.smOutline}>
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <NavLink href="/login" className={navLink}>
                    Log in
                  </NavLink>
                  <Link href="/register" className={btn.smPrimary}>
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
            <h1 className="mt-2 font-display text-[2rem] leading-tight font-bold tracking-tight lg:text-[2.5rem]">{title}</h1>
            {subtitle && <div className="mt-2 text-muted">{subtitle}</div>}
            {children && <div className="mt-6">{children}</div>}
          </div>
        </div>
      )}
    </>
  );
}
