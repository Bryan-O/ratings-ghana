import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { FeedbackWidget } from "@/components/feedback-widget";
import { feedbackEnabled } from "@/lib/features";
import { getCurrentUser } from "@/lib/session";

const heading = Lexend({ variable: "--font-heading", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const body = Source_Sans_3({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "RatingsGhana — honest reviews of businesses in Ghana", template: "%s · RatingsGhana" },
  description:
    "Find businesses Ghanaians trust. Every reviewer on RatingsGhana verifies a Ghana phone number, so ratings come from real people.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = feedbackEnabled ? await getCurrentUser() : null;
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans text-[17px] leading-relaxed">
        {children}
        {feedbackEnabled && <FeedbackWidget signedIn={Boolean(user)} />}
      </body>
    </html>
  );
}
