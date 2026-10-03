import { describe, expect, it } from "vitest";
import { csvCell, describeUserAgent } from "@/lib/user-agent";
import { feedbackSchema } from "@/lib/validation";

describe("describeUserAgent", () => {
  it.each([
    ["Mozilla/5.0 (Linux; Android 13; SM-A135F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36", "Chrome on Android"],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1", "Safari on iOS"],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Edg/120.0", "Edge on Windows"],
    ["Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0 Mobile Safari/537.36", "Samsung Internet on Android"],
    [null, "Unknown device"],
  ])("%s", (ua, expected) => expect(describeUserAgent(ua)).toBe(expected));
});

describe("csvCell", () => {
  it("quotes commas, quotes and newlines", () => {
    expect(csvCell('He said "hi", then\nleft')).toBe('"He said ""hi"", then\nleft"');
    expect(csvCell("plain")).toBe("plain");
    expect(csvCell(null)).toBe("");
  });
  it("neutralises spreadsheet formulas", () => {
    expect(csvCell("=HYPERLINK(\"http://evil\")")).toBe("\"'=HYPERLINK(\"\"http://evil\"\")\"");
    expect(csvCell("+233241234567")).toBe("'+233241234567");
    expect(csvCell("@cmd")).toBe("'@cmd");
  });
});

describe("feedbackSchema", () => {
  const ok = { type: "BUG", message: "The submit button did nothing", email: "", path: "/businesses/new", viewport: "390x844" };
  it("accepts a normal message and drops an empty email", () => {
    const r = feedbackSchema.parse(ok);
    expect(r.email).toBeUndefined();
    expect(r.viewport).toBe("390x844");
  });
  it("requires a type and a meaningful message", () => {
    expect(feedbackSchema.safeParse({ ...ok, type: undefined }).success).toBe(false);
    expect(feedbackSchema.safeParse({ ...ok, message: "hi" }).success).toBe(false);
  });
  it("rejects a bad email but tolerates junk page/viewport values", () => {
    expect(feedbackSchema.safeParse({ ...ok, email: "nope" }).success).toBe(false);
    const r = feedbackSchema.parse({ ...ok, path: "https://evil.com", viewport: "<script>" });
    expect(r.path).toBe("/");
    expect(r.viewport).toBeUndefined();
  });
});
