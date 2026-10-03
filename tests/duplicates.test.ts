import { describe, expect, it } from "vitest";
import { nameSimilarity, nameTokens, rankDuplicates, websiteKey } from "@/lib/duplicates";

describe("nameTokens", () => {
  it("drops generic words and punctuation", () => {
    expect(nameTokens("Drezzup Stores Ltd.")).toEqual(["drezzup"]);
    expect(nameTokens("Ike’s Cafe & Grill")).toEqual(["ikes", "cafe", "grill"]);
  });
});

describe("nameSimilarity", () => {
  it("matches names that share their identifying words", () => {
    expect(nameSimilarity("Drezzup Stores", "Drezzup Sneakers")).toBe(1);
    expect(nameSimilarity("Rakho Fufu Joint", "Rakho Fufu")).toBe(1);
    expect(nameSimilarity("KFC Baatsona", "KFC Spintex")).toBe(0.5);
  });
  it("does not match unrelated names", () => {
    expect(nameSimilarity("Atta B Rice", "Lancaster Hotel")).toBe(0);
    expect(nameSimilarity("Ltd", "The Store")).toBe(0);
  });
});

describe("websiteKey", () => {
  it("normalises social pages to platform/handle", () => {
    expect(websiteKey("https://www.instagram.com/drezzupsneakers/?hl=en")).toBe("instagram.com/drezzupsneakers");
    expect(websiteKey("instagram.com/DrezzupSneakers")).toBe("instagram.com/drezzupsneakers");
    expect(websiteKey("https://instagram.com/")).toBeNull();
  });
  it("uses the bare domain for normal websites", () => {
    expect(websiteKey("https://www.jumia.com.gh/phones/")).toBe("jumia.com.gh");
    expect(websiteKey(null)).toBeNull();
    expect(websiteKey("not a url ::")).toBeNull();
  });
});

describe("rankDuplicates", () => {
  const candidates = [
    { id: "1", name: "Drezzup Sneakers", website: null },
    { id: "2", name: "Totally Different Name", website: "https://instagram.com/drezzupsneakers" },
    { id: "3", name: "Lancaster Hotel", website: null },
    { id: "self", name: "Drezzup Stores", website: null },
  ];
  it("finds same-website and similar-name matches, best first, excluding itself", () => {
    const r = rankDuplicates({ id: "self", name: "Drezzup Stores", website: "https://www.instagram.com/drezzupsneakers/?hl=en" }, candidates);
    expect(r.map((m) => [m.id, m.reason])).toEqual([
      ["2", "same-website"],
      ["1", "similar-name"],
    ]);
  });
});
