import "server-only";
import { writeToDevOutbox } from "@/lib/outbox";

export function appUrl(): string {
  return (process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function sendVerificationEmail(to: string, link: string): Promise<void> {
  const subject = "Verify your RatingsGhana email";
  const text = `Welcome to RatingsGhana!\n\nConfirm your email address to finish creating your account:\n${link}\n\nThis link expires in 24 hours. If you didn't sign up, you can ignore this email.`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY is not set");
    await writeToDevOutbox("email", to, `${subject} — ${link}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "RatingsGhana <onboarding@resend.dev>",
      to,
      subject,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}
