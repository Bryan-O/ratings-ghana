import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/actions/state";
import { slugify } from "@/lib/slug";
import { businessSchema, registerSchema, reviewSchema } from "@/lib/validation";

describe("reviewSchema", () => {
  const ok = { businessId: "b1", rating: "4", title: "Great jollof", body: "The jollof was smoky and the staff were very friendly." };
  it("accepts a valid review and coerces rating", () => {
    expect(reviewSchema.parse(ok).rating).toBe(4);
  });
  it.each([["0"], ["6"], ["3.5"], [""]])("rejects rating %s", (rating) => {
    expect(reviewSchema.safeParse({ ...ok, rating }).success).toBe(false);
  });
  it("requires a meaningful body", () => {
    expect(reviewSchema.safeParse({ ...ok, body: "Nice" }).success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("normalises email and requires a strong-ish password", () => {
    const r = registerSchema.parse({ name: "Ama", email: " Ama@Example.COM ", password: "abc12345" });
    expect(r.email).toBe("ama@example.com");
    expect(registerSchema.safeParse({ name: "Ama", email: "a@b.co", password: "abcdefgh" }).success).toBe(false);
  });
});

describe("businessSchema", () => {
  const base = { name: "Auntie Muni Waakye", category: "Restaurant", description: "Waakye with all the extras, served from 6am." };
  it("requires address and city for physical businesses", () => {
    const r = businessSchema.safeParse({ ...base, type: "PHYSICAL", address: "", city: "", region: "", website: "" });
    expect(r.success).toBe(false);
    const paths = r.error!.issues.map((i) => i.path.join("."));
    expect(paths).toEqual(expect.arrayContaining(["address", "city"]));
  });
  it("requires a website for online businesses", () => {
    expect(businessSchema.safeParse({ ...base, type: "ONLINE", website: "" }).success).toBe(false);
    expect(businessSchema.safeParse({ ...base, type: "ONLINE", website: "https://shop.example.com", region: "" }).success).toBe(true);
  });
});

describe("safeNext", () => {
  it.each([
    ["/businesses/x", "/businesses/x"],
    ["//evil.com", "/"],
    ["/\\evil.com", "/"],
    ["https://evil.com", "/"],
    [null, "/"],
  ])("%s -> %s", (input, expected) => expect(safeNext(input)).toBe(expected));
});

describe("slugify", () => {
  it("makes URL-safe slugs", () => {
    expect(slugify("Ike’s Cafe & Grill Kumasi")).toBe("ikes-cafe-grill-kumasi");
  });
});
