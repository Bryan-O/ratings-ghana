import { describe, expect, it } from "vitest";
import { OTP_MAX_ATTEMPTS, generateOtpCode, hashOtpCode, otpMatches, otpState } from "@/lib/otp";

const phone = "+233241234567";

describe("OTP codes", () => {
  it("generates 6-digit codes", () => {
    for (let i = 0; i < 200; i++) expect(generateOtpCode()).toMatch(/^\d{6}$/);
  });

  it("matches only the right code for the right phone", () => {
    const hash = hashOtpCode("123456", phone);
    expect(hash).not.toContain("123456");
    expect(otpMatches("123456", phone, hash)).toBe(true);
    expect(otpMatches("123457", phone, hash)).toBe(false);
    expect(otpMatches("123456", "+233551234567", hash)).toBe(false);
  });

  it("handles malformed stored hashes", () => {
    expect(otpMatches("123456", phone, "abc")).toBe(false);
  });
});

describe("otpState", () => {
  const now = new Date("2026-01-01T12:00:00Z");
  const base = { expiresAt: new Date("2026-01-01T12:05:00Z"), attempts: 0, consumedAt: null };

  it("is ok when fresh", () => expect(otpState(base, now)).toBe("ok"));
  it("expires", () => expect(otpState({ ...base, expiresAt: now }, now)).toBe("expired"));
  it("locks after max attempts", () =>
    expect(otpState({ ...base, attempts: OTP_MAX_ATTEMPTS }, now)).toBe("too_many_attempts"));
  it("cannot be reused", () => expect(otpState({ ...base, consumedAt: now }, now)).toBe("consumed"));
});
