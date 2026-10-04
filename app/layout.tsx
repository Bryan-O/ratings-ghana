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
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans text-base leading-normal">
        <Suspense>
          <NavProgress />
        </Suspense>
        <MotionRuntime />
        {children}
        {feedbackEnabled && <FeedbackWidget signedIn={Boolean(user)} />}
      </body>
    </html>
  );
}
