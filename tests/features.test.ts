import { describe, expect, it } from "vitest";
import { emailSignupEnabled, phoneVerificationMode } from "@/lib/features";

describe("phoneVerificationMode", () => {
  it("uses text codes when Arkesel is configured", () => {
    expect(phoneVerificationMode({ SMS_PROVIDER: "arkesel", NODE_ENV: "production" })).toBe("sms");
  });
  it("falls back to admin verification in production without an SMS provider", () => {
    expect(phoneVerificationMode({ NODE_ENV: "production" })).toBe("manual");
    expect(phoneVerificationMode({ SMS_PROVIDER: "console", NODE_ENV: "production" })).toBe("manual");
  });
  it("can be forced to manual", () => {
    expect(phoneVerificationMode({ SMS_PROVIDER: "manual", NODE_ENV: "development" })).toBe("manual");
  });
  it("writes codes to the dev outbox locally", () => {
    expect(phoneVerificationMode({ NODE_ENV: "development" })).toBe("console");
  });
});

describe("emailSignupEnabled", () => {
  it("is on with Resend, or in development", () => {
    expect(emailSignupEnabled({ RESEND_API_KEY: "re_x", NODE_ENV: "production" })).toBe(true);
    expect(emailSignupEnabled({ NODE_ENV: "development" })).toBe(true);
  });
  it("is off in production without an email service (Google-only sign-up)", () => {
    expect(emailSignupEnabled({ NODE_ENV: "production" })).toBe(false);
    expect(emailSignupEnabled({ RESEND_API_KEY: "  ", NODE_ENV: "production" })).toBe(false);
  });
});
