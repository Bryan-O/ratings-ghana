import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/outbox", () => ({ writeToDevOutbox: vi.fn() }));

const { sendSms, SmsError } = await import("@/lib/sms");

function reply(status: number, body: unknown) {
  return vi.fn(async () => new Response(typeof body === "string" ? body : JSON.stringify(body), { status }));
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("sendSms", () => {
  it("refuses the console provider in production (also when SMS_PROVIDER is unset)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SMS_PROVIDER", "");
    await expect(sendSms("+233241234567", "hi")).rejects.toThrow(/SMS_PROVIDER/);
    await expect(sendSms("+233241234567", "hi")).rejects.toBeInstanceOf(SmsError);
  });

  it("needs an Arkesel API key", async () => {
    vi.stubEnv("SMS_PROVIDER", "arkesel");
    vi.stubEnv("ARKESEL_API_KEY", "");
    await expect(sendSms("+233241234567", "hi")).rejects.toThrow("ARKESEL_API_KEY is not set");
  });

  it("sends to Arkesel without the plus sign and resolves on success", async () => {
    vi.stubEnv("SMS_PROVIDER", "arkesel");
    vi.stubEnv("ARKESEL_API_KEY", "key");
    const fetch = reply(200, { status: "success", data: [] });
    vi.stubGlobal("fetch", fetch);
    await expect(sendSms("+233241234567", "hi")).resolves.toBeUndefined();
    const body = JSON.parse((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.recipients).toEqual(["233241234567"]);
  });

  it("treats a 200 reply with an error status as a failure", async () => {
    vi.stubEnv("SMS_PROVIDER", "arkesel");
    vi.stubEnv("ARKESEL_API_KEY", "key");
    vi.stubGlobal("fetch", reply(200, { status: "error", message: "Sender ID not approved" }));
    await expect(sendSms("+233241234567", "hi")).rejects.toThrow(/Sender ID not approved/);
  });

  it("reports the HTTP status and body when Arkesel rejects the request", async () => {
    vi.stubEnv("SMS_PROVIDER", "arkesel");
    vi.stubEnv("ARKESEL_API_KEY", "bad");
    vi.stubGlobal("fetch", reply(401, "Invalid API key"));
    await expect(sendSms("+233241234567", "hi")).rejects.toThrow(/HTTP 401 Invalid API key/);
  });
});
