import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";
import { MailIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Check your email" };

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return (
    <AuthCard
      title="Check your email"
      footer={
        <>
          Verified already?{" "}
          <Link href="/login" className="font-semibold text-brand hover:text-ink">Log in</Link>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <MailIcon size={30} />
        </span>
        <p className="text-body">
          We sent a verification link to {email ? <strong className="break-all text-ink">{email}</strong> : "your email address"}. Click it to
          activate your account — it expires in 24 hours.
        </p>
        <p className="text-sm text-muted">Can&apos;t find it? Check your spam folder.</p>
      </div>
    </AuthCard>
  );
}
