import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthCard, Terms, socialBtn } from "@/components/auth-card";
import { GoogleButton } from "@/components/google-button";
import { MailIcon } from "@/components/icons";
import { RegisterForm } from "@/app/register/register-form";
import { safeNext } from "@/lib/actions/state";
import { getCurrentUser } from "@/lib/session";
import { googleEnabled } from "@/lib/auth";
import { emailSignupEnabled } from "@/lib/features";

export const metadata: Metadata = { title: "Sign up" };

type SP = Promise<Record<string, string | undefined>>;

export default async function RegisterPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getCurrentUser()) redirect(next);
  const emailOn = emailSignupEnabled();
  const emailStep = emailOn && sp.method === "email";
  const nextQs = sp.next ? `next=${encodeURIComponent(next)}` : "";

  return (
    <AuthCard
      title="Create your account"
      subtitle="Say what happened, plainly and publicly. It takes about two minutes."
      footer={
        <>
          Already on RatingsGhana?{" "}
          <Link href={`/login${nextQs ? `?${nextQs}` : ""}`} className="font-semibold text-brand hover:text-ink">
            Log in
          </Link>
        </>
      }
    >
      {emailStep ? (
        <RegisterForm />
      ) : (
        <div className="flex flex-col gap-3">
          <GoogleButton next={next} />
          {emailOn ? (
            <Link href={`/register?method=email${nextQs ? `&${nextQs}` : ""}`} className={socialBtn}>
              <MailIcon /> Continue with email
            </Link>
          ) : (
            !googleEnabled && (
              // Neither Google nor an email service is set up yet.
              <p className="rounded-xl border-l-4 border-coral bg-coral-soft px-4 py-3 text-sm text-ink">
                Sign-up isn&rsquo;t open yet. Check back soon.
              </p>
            )
          )}
        </div>
      )}
      <p className="mt-6 rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand">
        To keep reviews genuine, you&apos;ll also verify a Ghana phone number before posting your first review.
      </p>
      <Terms />
    </AuthCard>
  );
}
