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
      title={verified ? "Your phone is verified" : "Prove you\u2019re a real person"}
      subtitle={
        verified
          ? undefined
          : "We\u2019ll text you a code. Each mobile number can back one account, and it\u2019s never shown publicly."
      }
      footer={<Link href={next} className="font-semibold text-brand transition-colors duration-200 hover:text-ink">Back</Link>}
    >
      {verified ? (
        <Notice ok>{formatGhanaPhone(user.phone!)} is verified. You&apos;re all set to write reviews.</Notice>
      ) : (
        <VerifyPhoneForm next={next} />
      )}
    </AuthCard>
  );
}
