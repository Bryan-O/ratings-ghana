import "server-only";
import { writeToDevOutbox } from "@/lib/outbox";

/** Send an SMS to an E.164 Ghana number. Provider is chosen by SMS_PROVIDER. */
export async function sendSms(to: string, message: string): Promise<void> {
  const provider = process.env.SMS_PROVIDER ?? "console";

  if (provider === "console") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMS_PROVIDER=console is not allowed in production");
    }
    await writeToDevOutbox("sms", to, message);
    return;
  }

  if (provider === "arkesel") {
    const apiKey = process.env.ARKESEL_API_KEY;
    if (!apiKey) throw new Error("ARKESEL_API_KEY is not set");
    const res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: process.env.ARKESEL_SENDER_ID ?? "RatingsGH",
        message,
        recipients: [to.replace(/^\+/, "")],
      }),
    });
    if (!res.ok) throw new Error(`Arkesel SMS failed: ${res.status} ${await res.text()}`);
    return;
  }

  throw new Error(`Unknown SMS_PROVIDER "${provider}"`);
}
