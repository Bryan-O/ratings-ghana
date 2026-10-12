import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { FeedbackWidget } from "@/components/feedback-widget";
import { NavProgress } from "@/components/nav-progress";
import { MotionRuntime } from "@/components/motion-runtime";
import { MOTION_BOOT_SCRIPT } from "@/lib/motion";
import { feedbackEnabled } from "@/lib/features";
import { getCurrentUser } from "@/lib/session";

// Space Grotesk Bold: headlines, rating numerals. Inter: body, labels, forms, actions.
const heading = Space_Grotesk({ variable: "--font-heading", subsets: ["latin"], weight: ["500", "700"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "RatingsGhana — honest reviews of businesses in Ghana", template: "%s · RatingsGhana" },
  description:
    "Find businesses Ghanaians trust. Every reviewer on RatingsGhana verifies a Ghana phone number, so ratings come from real people.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = feedbackEnabled ? await getCurrentUser() : null;
  return (
    // data-motion is set by the boot script before React hydrates, hence suppressHydrationWarning.
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/*
          A plain inline script on purpose: it is server-rendered into <head> and runs before the body
          paints, so scroll-reveal items can start hidden without a flash. next/script's
          beforeInteractive goes through Next's loader and gives no such guarantee. React logs a
          dev-only "script tag" notice for this; it is harmless.
        */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans text-base leading-normal">
        <Suspense>
          <NavProgress />
        </Suspense>
        <MotionRuntime />
        {/* Lets keyboard and screen-reader users jump past the header. */}
        <a
          href="#main"
          className="sr-only z-[70] rounded-xl bg-ink font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4 focus:py-3"
        >
          Skip to content
        </a>
        {children}
        {feedbackEnabled && <FeedbackWidget signedIn={Boolean(user)} />}
      </body>
    </html>
  );
}
