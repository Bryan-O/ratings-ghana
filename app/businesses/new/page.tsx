import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SuggestBusinessForm } from "@/app/businesses/new/suggest-business-form";
import { ShieldCheckIcon } from "@/components/icons";
import { btn, card, container } from "@/components/ui";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";

export const metadata: Metadata = { title: "Add a business" };

export default async function NewBusinessPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/businesses/new");
  const step = nextVerificationStep(user);

  return (
    <>
      <SiteHeader
        title="Add a business"
        crumbs={[{ label: "Home", href: "/" }, { label: "Businesses", href: "/businesses" }]}
        subtitle="Can't find a business? Add it here. Physical shops and online sellers are both welcome — our team checks every listing before it goes live."
      />
      <main className={`${container} flex-1 py-10`}>
        <div className="mx-auto max-w-2xl">
          {step === "verify-phone" ? (
            <div className={`${card} flex flex-col items-start gap-4 p-6`}>
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand"><ShieldCheckIcon size={24} /></span>
              <p className="text-body">Please verify your phone number before adding a business. It helps us keep listings genuine.</p>
              <Link href="/verify-phone?next=/businesses/new" className={btn.primary}>Verify phone number</Link>
            </div>
          ) : (
            <SuggestBusinessForm />
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
