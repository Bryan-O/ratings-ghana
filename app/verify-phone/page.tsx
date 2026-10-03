import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth-card";
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

  return (
    <AuthCard
      title="Verify your phone number"
      footer={<Link href={next} className="font-semibold text-ink">Back</Link>}
    >
      {user.phoneVerifiedAt && user.phone ? (
        <p className="rounded-[4px] bg-green-50 px-3 py-2 text-center text-sm text-green-800">
          {formatGhanaPhone(user.phone)} is verified. You&apos;re all set to write reviews.
        </p>
      ) : (
        <>
          <p className="mb-5 text-center text-xs text-[#888]">
            RatingsGhana links each account to one Ghana mobile number so that every review comes from a real person. We&apos;ll text
            you a 6-digit code. Your number is never shown publicly.
          </p>
          <VerifyPhoneForm next={next} />
        </>
      )}
    </AuthCard>
  );
}
