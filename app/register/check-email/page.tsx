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
          <Link href="/login" className="font-semibold text-ink">Log in</Link>
        </>
      }
    >
      <div className="flex flex-col items-center gap-3 text-center text-sm text-ink">
        <MailIcon size={32} />
        <p>
          We sent a verification link to {email ? <strong className="break-all">{email}</strong> : "your email address"}. Click it to
          activate your account. The link expires in 24 hours.
        </p>
        <p className="text-muted">Can&apos;t find it? Check your spam folder.</p>
      </div>
    </AuthCard>
  );
}
