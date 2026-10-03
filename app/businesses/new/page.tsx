import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SuggestBusinessForm } from "@/app/businesses/new/suggest-business-form";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";

export const metadata: Metadata = { title: "Add a business" };

export default async function NewBusinessPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/businesses/new");
  const step = nextVerificationStep(user);

  return (
    <>
      <SiteHeader title="Add a business" crumbs={[{ label: "Home", href: "/" }, { label: "Businesses", href: "/businesses" }]} />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-4 py-8">
        <p className="text-muted">
          Can&apos;t find a business on RatingsGhana? Add it here. Physical shops and online sellers are both welcome. Our team checks
          every listing before it goes live.
        </p>
        {step === "verify-phone" ? (
          <p className="mt-6 rounded-[4px] bg-page p-5 text-sm">
            Please{" "}
            <Link href="/verify-phone?next=/businesses/new" className="font-semibold underline">verify your phone number</Link>{" "}
            before adding a business.
          </p>
        ) : (
          <SuggestBusinessForm />
        )}
      </main>
    </>
  );
}
