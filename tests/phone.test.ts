import { describe, expect, it } from "vitest";
import { formatGhanaPhone, maskGhanaPhone, normalizeGhanaPhone } from "@/lib/phone";

describe("normalizeGhanaPhone", () => {
  it.each([
    ["0241234567", "+233241234567"],
    ["024 123 4567", "+233241234567"],
    ["024-123-4567", "+233241234567"],
    ["+233 24 123 4567", "+233241234567"],
    ["233241234567", "+233241234567"],
    ["241234567", "+233241234567"],
    ["0551234567", "+233551234567"],
    ["0201234567", "+233201234567"],
    ["0591234567", "+233591234567"],
  ])("accepts %s", (input, expected) => {
    expect(normalizeGhanaPhone(input)).toBe(expected);
  });

  it.each([
    "",
    "12345",
    "024123456", // too short
    "02412345678", // too long
    "0301234567", // landline prefix
    "0211234567", // not a mobile prefix
    "+234241234567", // Nigeria
    "+2330241234567", // trunk zero after country code
    "abc0241234567",
  ])("rejects %s", (input) => {
    expect(normalizeGhanaPhone(input)).toBeNull();
  });
});

describe("formatting", () => {
  it("formats and masks", () => {
    expect(formatGhanaPhone("+233241234567")).toBe("+233 24 123 4567");
    expect(maskGhanaPhone("+233241234567")).toBe("+233 24 *** 4567");
  });
});
