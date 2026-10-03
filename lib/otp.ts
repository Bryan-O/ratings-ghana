import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_MAX_SENDS_PER_HOUR = 5;

export function generateOtpCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

/** HMAC rather than a bare hash so a leaked DB row can't be brute-forced offline. */
export function hashOtpCode(code: string, phone: string): string {
  return createHmac("sha256", secret()).update(`${phone}:${code}`).digest("hex");
}

export function otpMatches(code: string, phone: string, codeHash: string): boolean {
  const a = Buffer.from(hashOtpCode(code, phone), "hex");
  const b = Buffer.from(codeHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export type OtpRecord = {
  expiresAt: Date;
  attempts: number;
  consumedAt: Date | null;
};

export type OtpState = "ok" | "expired" | "too_many_attempts" | "consumed";

/** Whether an OTP can still be checked against a submitted code. */
export function otpState(otp: OtpRecord, now: Date = new Date()): OtpState {
  if (otp.consumedAt) return "consumed";
  if (otp.attempts >= OTP_MAX_ATTEMPTS) return "too_many_attempts";
  if (otp.expiresAt.getTime() <= now.getTime()) return "expired";
  return "ok";
}
