import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthCard, OrDivider, Terms } from "@/components/auth-card";
import { GoogleButton } from "@/components/google-button";
import { LoginForm } from "@/app/login/login-form";
import { googleEnabled } from "@/lib/auth";
import { safeNext } from "@/lib/actions/state";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Log in" };

type SP = Promise<Record<string, string | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getCurrentUser()) redirect(next);

  const notice =
    sp.verified === "1"
      ? { ok: true, text: "Email verified! You can now log in." }
      : sp.verified === "invalid"
        ? { ok: false, text: "That verification link is invalid or has expired. Log in to get a new one." }
        : sp.error
          ? { ok: false, text: "Sign-in failed. Please try again." }
          : null;

  return (
    <AuthCard
      title="Sign in to RatingsGhana"
      footer={
        <>
          New to RatingsGhana?{" "}
          <Link href={`/register${sp.next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink">
            Sign up
          </Link>
        </>
      }
    >
      <Terms />
      {notice && (
        <p role="status" className={`mt-4 rounded-[4px] px-3 py-2 text-sm ${notice.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {notice.text}
        </p>
      )}
      {googleEnabled && (
        <>
          <div className="mt-5">
            <GoogleButton next={next} />
          </div>
          <OrDivider />
        </>
      )}
      <div className={googleEnabled ? "" : "mt-5"}>
        <LoginForm next={next} />
      </div>
    </AuthCard>
  );
}
