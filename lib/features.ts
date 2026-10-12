/** Tester feedback button; turn off with FEEDBACK_ENABLED=false (e.g. after the test phase). */
export const feedbackEnabled = process.env.FEEDBACK_ENABLED !== "false";

type Env = Record<string, string | undefined>;

/**
 * How people verify their phone:
 * - "sms": a code by text (SMS_PROVIDER=arkesel), the normal way;
 * - "manual": test phase without an SMS provider. People submit their number and an admin
 *   verifies it in /admin. Used when SMS_PROVIDER=manual, or in production when no provider is set;
 * - "console": local development; codes go to .dev-outbox.log.
 */
export type PhoneMode = "sms" | "manual" | "console";

export function phoneVerificationMode(env: Env = process.env): PhoneMode {
  const provider = env.SMS_PROVIDER?.trim() || "console";
  if (provider === "arkesel") return "sms";
  if (provider === "manual") return "manual";
  return env.NODE_ENV === "production" ? "manual" : "console";
}

/**
 * Email/password sign-up needs a way to send the verification email: Resend in production,
 * the dev outbox locally. Without it, sign-up is Google-only (Google verifies emails itself).
 */
export function emailSignupEnabled(env: Env = process.env): boolean {
  return Boolean(env.RESEND_API_KEY?.trim()) || env.NODE_ENV !== "production";
}
