import "server-only";
import { writeToDevOutbox } from "@/lib/outbox";

/** The text could not be sent. `message` says why (for the server logs, not for users). */
export class SmsError extends Error {
  name = "SmsError";
}

/** Send an SMS to an E.164 Ghana number. Provider is chosen by SMS_PROVIDER. Throws SmsError on failure. */
export async function sendSms(to: string, message: string): Promise<void> {
  const provider = process.env.SMS_PROVIDER ?? "console";

  if (provider === "console") {
    if (process.env.NODE_ENV === "production") {
      throw new SmsError("SMS_PROVIDER is unset or 'console', which is not allowed in production. Set SMS_PROVIDER=arkesel.");
    }
    await writeToDevOutbox("sms", to, message);
    return;
  }

  if (provider === "arkesel") {
    const apiKey = process.env.ARKESEL_API_KEY;
    if (!apiKey) throw new SmsError("ARKESEL_API_KEY is not set");
    let res: Response;
    try {
      res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
        method: "POST",
        headers: { "api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: process.env.ARKESEL_SENDER_ID ?? "RatingsGH",
          message,
          recipients: [to.replace(/^\+/, "")],
        }),
        signal: AbortSignal.timeout(15_000),
      });
    } catch (e) {
      throw new SmsError(`Arkesel unreachable: ${(e as Error).message}`);
    }
    const text = await res.text();
    // Arkesel can answer 200 with {"status":"error",...} (e.g. unapproved sender ID, no balance).
    let status: unknown;
    try {
      status = (JSON.parse(text) as { status?: unknown }).status;
    } catch {
      status = undefined;
    }
    if (!res.ok || (status !== undefined && status !== "success")) {
      throw new SmsError(`Arkesel SMS failed: HTTP ${res.status} ${text.slice(0, 500)}`);
    }
    return;
  }

  throw new SmsError(`Unknown SMS_PROVIDER "${provider}"`);
}
