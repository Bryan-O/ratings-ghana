import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";
import { Breadcrumb, type Crumb } from "@/components/breadcrumb";
import { MobileMenu } from "@/components/mobile-menu";
import { LogoMark, ShieldCheckIcon } from "@/components/icons";
import { container } from "@/components/ui";

type Props = {
  /** Inner pages get a title band with a breadcrumb under the top bar. */
  title?: string;
  subtitle?: React.ReactNode;
  crumbs?: Crumb[];
  /** Extra content inside the title band (e.g. a search bar). */
  children?: React.ReactNode;
};

const navLink =
  "rounded-lg px-3 py-2 text-[15px] font-semibold text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white";

export async function SiteHeader({ title, subtitle, crumbs, children }: Props) {
  const user = await getCurrentUser();
  const step = nextVerificationStep(user);

  const links = [
    { href: "/businesses", label: "Businesses" },
    { href: "/businesses", label: "Write a review" },
    ...(user ? [{ href: "/businesses/new", label: "Add a business" }] : []),
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand shadow-[0_1px_0_rgba(255,255,255,0.08)]">
        <div className={`${container} flex h-16 items-center justify-between gap-4`}>
          <Link href="/" className="flex items-center gap-2.5 rounded-lg text-white">
            <LogoMark className="text-white [&>rect]:fill-white/15" />
            <span className="font-display text-xl font-bold tracking-tight">RatingsGhana</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className={navLink}>
                {l.label}
              </Link>
            ))}
            <div className="ml-3 flex items-center gap-2 border-l border-white/20 pl-4">
              {user ? (
                <>
                  <span className="max-w-40 truncate text-sm font-semibold text-white/80" title={user.email}>
                    {user.name ?? user.email}
                  </span>
                  <form action={signOutAction}>
                    <button type="submit" className="h-10 cursor-pointer rounded-xl border-2 border-white/40 px-4 text-sm font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className={navLink}>
                    Login
                  </Link>
                  <Link href="/register" className="inline-flex h-10 items-center rounded-xl bg-cta px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-cta-hover">
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>

          <MobileMenu links={links} signedIn={Boolean(user)} userLabel={user?.name ?? user?.email ?? undefined} />
        </div>
      </header>

      {user && step === "verify-phone" && (
        <div className="bg-brand-night px-4 py-2.5 text-center text-sm text-white">
          <ShieldCheckIcon size={16} className="mr-1.5 inline -mt-0.5 text-brand-light" />
          Verify your phone number to start writing reviews.{" "}
          <Link href="/verify-phone" className="font-semibold underline underline-offset-2 hover:text-brand-light">
            Verify now
          </Link>
        </div>
      )}

      {title && (
        <div className="border-b border-line bg-white">
          <div className={`${container} py-8 lg:py-10`}>
            {crumbs && <Breadcrumb crumbs={crumbs} />}
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1>
            {subtitle && <div className="mt-2 text-muted">{subtitle}</div>}
            {children && <div className="mt-6">{children}</div>}
          </div>
        </div>
      )}
    </>
  );
}
