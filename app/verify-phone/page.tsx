import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthCard, Notice } from "@/components/auth-card";
import { VerifyPhoneForm } from "@/app/verify-phone/verify-phone-form";
import { safeNext } from "@/lib/actions/state";
import { formatGhanaPhone } from "@/lib/phone";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Verify your phone" };

export default async function VerifyPhonePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next: rawNext } = await searchParams;
  const next = safeNext(rawNext);
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/verify-phone?next=${next}`)}`);

  const verified = Boolean(user.phoneVerifiedAt && user.phone);
  return (
    <AuthCard
      title="Verify your phone number"
      subtitle={
        verified
          ? undefined
          : "RatingsGhana links each account to one Ghana mobile number so every review comes from a real person. Your number is never shown publicly."
      }
      footer={<Link href={next} className="font-semibold text-brand hover:text-brand-hover">Back</Link>}
    >
      {verified ? (
        <Notice ok>{formatGhanaPhone(user.phone!)} is verified. You&apos;re all set to write reviews.</Notice>
      ) : (
        <VerifyPhoneForm next={next} />
      )}
    </AuthCard>
  );
}
