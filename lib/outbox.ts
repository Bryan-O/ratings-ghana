import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Dev-only stand-in for SMS/email delivery: logs to the console and appends to
// .dev-outbox.log so you (and the e2e tests) can read OTPs and links.
export async function writeToDevOutbox(channel: "sms" | "email", to: string, body: string) {
  const line = `[${new Date().toISOString()}] ${channel.toUpperCase()} to ${to}: ${body}`;
  console.log(`\n📬 ${line}\n`);
  const file = path.join(process.cwd(), ".dev-outbox.log");
  await mkdir(path.dirname(file), { recursive: true });
  await appendFile(file, line + "\n");
}
