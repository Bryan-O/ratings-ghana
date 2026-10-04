import "server-only";

export type SetupCheck = { area: string; ok: boolean; detail: string };

const set = (name: string) => Boolean(process.env[name]?.trim());

/**
 * Which external services are configured, for the admin page. Never includes secret values,
 * only whether they're set (plus non-secret settings such as the provider name or sender ID).
 */
export function setupChecks(): SetupCheck[] {
  const prod = process.env.NODE_ENV === "production";
  const sms = process.env.SMS_PROVIDER?.trim() || "console";
  const sender = process.env.ARKESEL_SENDER_ID?.trim() || "RatingsGH";
  const storage = process.env.STORAGE_PROVIDER?.trim() || "local";

  return [
    {
      area: "SMS provider",
      ok: sms === "arkesel" || (!prod && sms === "console"),
      detail:
        sms === "arkesel"
          ? "SMS_PROVIDER=arkesel"
          : `SMS_PROVIDER is "${sms}"${prod ? ". Set it to arkesel; phone verification fails in production until you do." : " (codes go to .dev-outbox.log)."}`,
    },
    ...(sms === "arkesel"
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
      area: "Email (Resend)",
      ok: set("RESEND_API_KEY") || !prod,
      detail: set("RESEND_API_KEY")
        ? `Set; sending from ${process.env.EMAIL_FROM || "(EMAIL_FROM not set)"}`
        : prod
          ? "RESEND_API_KEY is missing; sign-up emails fail"
          : "Not set (links go to .dev-outbox.log)",
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
