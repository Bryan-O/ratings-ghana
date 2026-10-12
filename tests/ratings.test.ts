import { describe, expect, it } from "vitest";
import { aggregateRatings, ratingDistribution, ratingLabel } from "@/lib/ratings";

describe("aggregateRatings", () => {
  it("handles no reviews", () => expect(aggregateRatings([])).toEqual({ avgRating: 0, reviewCount: 0 }));
  it("averages to one decimal", () => {
    expect(aggregateRatings([5, 4, 4])).toEqual({ avgRating: 4.3, reviewCount: 3 });
    expect(aggregateRatings([1, 2])).toEqual({ avgRating: 1.5, reviewCount: 2 });
  });
});

describe("ratingDistribution", () => {
  it("buckets by star and ignores out-of-range values", () => {
    expect(ratingDistribution([5, 5, 4, 1, 0, 6])).toEqual([1, 0, 0, 1, 2]);
  });
});

describe("ratingLabel", () => {
  it("says there is no rating until someone reviews", () => {
    expect(ratingLabel(0, 0)).toBe("No rating yet");
  });
  it("maps the average to a plain word at the boundaries", () => {
    expect(ratingLabel(5, 3)).toBe("Excellent");
    expect(ratingLabel(4.5, 3)).toBe("Excellent");
    expect(ratingLabel(4.4, 3)).toBe("Good");
    expect(ratingLabel(3.5, 3)).toBe("Good");
    expect(ratingLabel(3.4, 3)).toBe("Okay");
    expect(ratingLabel(2.4, 3)).toBe("Poor");
    expect(ratingLabel(1.4, 3)).toBe("Bad");
  });
});
