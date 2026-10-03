import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthCard, Terms, socialBtn } from "@/components/auth-card";
import { GoogleButton } from "@/components/google-button";
import { MailIcon } from "@/components/icons";
import { RegisterForm } from "@/app/register/register-form";
import { safeNext } from "@/lib/actions/state";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign up" };

type SP = Promise<Record<string, string | undefined>>;

export default async function RegisterPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getCurrentUser()) redirect(next);
  const emailStep = sp.method === "email";
  const nextQs = sp.next ? `next=${encodeURIComponent(next)}` : "";

  return (
    <AuthCard
      title="Sign up for RatingsGhana"
      footer={
        <>
          Already on RatingsGhana?{" "}
          <Link href={`/login${nextQs ? `?${nextQs}` : ""}`} className="font-semibold text-ink">
            Login
          </Link>
        </>
      }
    >
      <Terms />
      <div className="mt-6 flex flex-col gap-4">
        {emailStep ? (
          <RegisterForm />
        ) : (
          <>
            <GoogleButton next={next} />
            <Link href={`/register?method=email${nextQs ? `&${nextQs}` : ""}`} className={socialBtn}>
              <MailIcon /> <span className="flex-1 pr-8 text-center">Continue with email</span>
            </Link>
          </>
        )}
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        To keep reviews genuine, you&apos;ll also verify a Ghana phone number before posting your first review.
      </p>
    </AuthCard>
  );
}
