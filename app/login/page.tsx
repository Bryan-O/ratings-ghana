import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthCard, Notice, OrDivider, Terms } from "@/components/auth-card";
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
      title="Welcome back"
      subtitle="Log in to rate businesses and manage your reviews."
      footer={
        <>
          New to RatingsGhana?{" "}
          <Link href={`/register${sp.next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand hover:text-ink">
            Create an account
          </Link>
        </>
      }
    >
      {notice && <Notice ok={notice.ok}>{notice.text}</Notice>}
      {googleEnabled && (
        <>
          <GoogleButton next={next} />
          <OrDivider />
        </>
      )}
      <LoginForm next={next} />
      <Terms />
    </AuthCard>
  );
}
