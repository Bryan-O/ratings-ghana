import "server-only";
import { phoneVerificationMode } from "@/lib/features";

export type SetupCheck = { area: string; ok: boolean; detail: string };

const set = (name: string) => Boolean(process.env[name]?.trim());

/**
 * Which external services are configured, for the admin page. Never includes secret values,
 * only whether they're set (plus non-secret settings such as the provider name or sender ID).
 */
export function setupChecks(): SetupCheck[] {
  const prod = process.env.NODE_ENV === "production";
  const sender = process.env.ARKESEL_SENDER_ID?.trim() || "RatingsGH";
  const storage = process.env.STORAGE_PROVIDER?.trim() || "local";

  const phoneMode = phoneVerificationMode();
  const google = set("AUTH_GOOGLE_ID") && set("AUTH_GOOGLE_SECRET");
  const emailOn = set("RESEND_API_KEY");

  return [
    {
      area: "Phone verification",
      ok: true,
      detail:
        phoneMode === "sms"
          ? "Codes by text (SMS_PROVIDER=arkesel)"
          : phoneMode === "manual"
            ? "Test mode: people send their number and an admin verifies it below. Switch to SMS_PROVIDER=arkesel before public launch."
            : "Local development: codes go to .dev-outbox.log.",
    },
    ...(phoneMode === "sms"
      ? [
          { area: "Arkesel API key", ok: set("ARKESEL_API_KEY"), detail: set("ARKESEL_API_KEY") ? "Set" : "ARKESEL_API_KEY is missing" },
          {
            area: "Arkesel sender ID",
            ok: sender.length <= 11,
            detail: `"${sender}"${sender.length > 11 ? " is longer than 11 characters" : ""}. It must be registered and approved in your Arkesel account.`,
          },
        ]
      : []),
    {
      area: "Google sign-in",
      ok: google || emailOn || !prod,
      detail: google
        ? "On. People can sign up with Google (their email is already verified by Google)."
        : emailOn || !prod
          ? "Off (optional): set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET to add it."
          : "Off, and email sign-up is off too, so nobody can sign up. Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET.",
    },
    {
      area: "Email sign-up (Resend)",
      ok: emailOn || !prod || google,
      detail: emailOn
        ? `On; sending from ${process.env.EMAIL_FROM || "(EMAIL_FROM not set)"}`
        : !prod
          ? "Not set (links go to .dev-outbox.log)."
          : google
            ? "Off: sign-up is Google-only. Add RESEND_API_KEY (needs your own domain) to allow email sign-up."
            : "Off: RESEND_API_KEY is missing.",
    },
    {
      area: "Photo storage",
      ok: storage === "vercel-blob" ? set("BLOB_READ_WRITE_TOKEN") : !prod,
      detail:
        storage === "vercel-blob"
          ? set("BLOB_READ_WRITE_TOKEN")
            ? "Vercel Blob connected"
            : "STORAGE_PROVIDER=vercel-blob but BLOB_READ_WRITE_TOKEN is missing (connect a Blob store)"
          : `STORAGE_PROVIDER is "${storage}"${prod ? ". Set it to vercel-blob; photo uploads fail in production until you do." : " (files in .uploads/)."}`,
    },
  ];
}
