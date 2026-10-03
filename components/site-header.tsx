import Link from "next/link";
import { signOutAction } from "@/lib/actions/auth";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";
import { Breadcrumb, type Crumb } from "@/components/breadcrumb";
import { MobileMenu } from "@/components/mobile-menu";
import { ShieldCheckIcon } from "@/components/icons";

const navLink = "flex h-[43px] items-center justify-center px-5 text-base font-bold text-ink hover:underline";
const solidBtn = "flex h-[43px] items-center justify-center rounded-[4px] bg-btn px-[34px] text-base font-bold text-white hover:bg-black";
const outlineBtn = "flex h-[43px] items-center justify-center rounded-[4px] border-2 border-btn px-6 text-base font-bold text-btn hover:bg-btn hover:text-white";

type Props = {
  /** Inner pages show a breadcrumb + page title instead of the big wordmark. */
  title?: string;
  crumbs?: Crumb[];
};

export async function SiteHeader({ title, crumbs }: Props) {
  const user = await getCurrentUser();
  const step = nextVerificationStep(user);

  const links = [
    { href: "/businesses", label: "Write a review" },
    { href: "/businesses", label: "Businesses" },
    ...(user ? [{ href: "/businesses/new", label: "Add a business" }] : []),
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  const nav = (
    <nav aria-label="Main" className="hidden items-center gap-2 lg:flex">
      {links.map((l) => (
        <Link key={l.label} href={l.href} className={navLink}>
          {l.label}
        </Link>
      ))}
      <div className="ml-2 flex items-center gap-4">
        {user ? (
          <>
            <span className="max-w-40 truncate text-sm font-medium text-muted" title={user.email}>
              {user.name ?? user.email}
            </span>
            <form action={signOutAction}>
              <button type="submit" className={outlineBtn}>
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/register" className={solidBtn}>
              Register
            </Link>
            <Link href="/login" className={outlineBtn}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile bar (Figma Mobile/* frames) */}
      <div className="flex h-[64px] items-center justify-between bg-btn px-4 text-white lg:hidden">
        <Link href="/" className="text-lg tracking-wide">
          RATINGS GHANA
        </Link>
        <MobileMenu links={links} signedIn={Boolean(user)} userLabel={user?.name ?? user?.email ?? undefined} />
      </div>

      {title ? (
        <header className="border-b border-hairline">
          <div className="mx-auto flex max-w-[1512px] items-end justify-between gap-6 px-4 pt-6 pb-6 lg:px-[34px] lg:pt-[86px] lg:pb-[30px]">
            <div className="min-w-0">
              {crumbs && <Breadcrumb crumbs={crumbs} />}
              <h1 className="mt-2 text-[28px] font-medium leading-tight text-black lg:text-[36px]">{title}</h1>
            </div>
            {nav}
          </div>
        </header>
      ) : (
        <header className="mx-auto hidden w-full max-w-[1512px] items-center justify-between px-12 py-9 lg:flex">
          <Link href="/" className="text-[40px] leading-none text-ink">
            RATINGS GHANA
          </Link>
          {nav}
        </header>
      )}

      {user && step === "verify-phone" && (
        <div className="bg-ink px-4 py-2.5 text-center text-sm text-white">
          <ShieldCheckIcon className="mr-1.5 inline -mt-0.5" />
          Verify your phone number to start writing reviews.{" "}
          <Link href="/verify-phone" className="font-semibold underline">
            Verify now
          </Link>
        </div>
      )}
    </>
  );
}
