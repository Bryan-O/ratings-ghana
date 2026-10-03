import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

const OUTBOX = path.join(process.cwd(), ".dev-outbox.log");

function readOutbox(): string {
  try {
    return readFileSync(OUTBOX, "utf8");
  } catch {
    return "";
  }
}

/** Poll the dev outbox for the latest message to `to` matching `pattern`. */
export async function waitForOutbox(to: string, pattern: RegExp): Promise<RegExpMatchArray> {
  for (let i = 0; i < 50; i++) {
    const lines = readOutbox().split("\n").filter((l) => l.includes(` to ${to}: `)).reverse();
    for (const line of lines) {
      const m = line.match(pattern);
      if (m) return m;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`No outbox message to ${to} matching ${pattern}`);
}

export function uniqueEmail(tag: string) {
  return `e2e-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
}

/** A random valid MTN-style number in national format and E.164. */
export function uniquePhone() {
  const rest = String(Math.floor(Math.random() * 1e7)).padStart(7, "0");
  return { national: `024${rest}`, e164: `+23324${rest}` };
}

export async function registerAndVerifyEmail(page: Page, email: string, name = "Ama Mensah") {
  await page.goto("/register");
  await page.getByRole("link", { name: "Continue with email" }).click();
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Sup3rSecret!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();

  const [, link] = await waitForOutbox(email, /(http\S+\/api\/verify-email\?token=\S+)/);
  await page.goto(new URL(link).pathname + new URL(link).search);
  await expect(page.getByText("Email verified! You can now log in.")).toBeVisible();
}

export async function login(page: Page, email: string, password = "Sup3rSecret!", { expectSuccess = true } = {}) {
  await page.getByPlaceholder("johndoe@email.com").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  if (expectSuccess) await page.waitForURL((u) => !u.pathname.startsWith("/login"));
}

export async function verifyPhone(page: Page, phone: { national: string; e164: string }) {
  await page.getByLabel("Ghana mobile number").fill(phone.national);
  await page.getByRole("button", { name: "Send code" }).click();
  const [, code] = await waitForOutbox(phone.e164, /code is (\d{6})/);
  await page.getByLabel(/Enter the 6-digit code/).fill(code);
  await page.getByRole("button", { name: "Verify" }).click();
  // Wait for the redirect so the verification is saved before the test moves on.
  await page.waitForURL((u) => !u.pathname.startsWith("/verify-phone"));
}
