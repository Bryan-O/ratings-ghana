import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const heading = Lexend({ variable: "--font-heading", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const body = Source_Sans_3({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "RatingsGhana — honest reviews of businesses in Ghana", template: "%s · RatingsGhana" },
  description:
    "Find businesses Ghanaians trust. Every reviewer on RatingsGhana verifies a Ghana phone number, so ratings come from real people.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans text-[17px] leading-relaxed">{children}</body>
    </html>
  );
}
