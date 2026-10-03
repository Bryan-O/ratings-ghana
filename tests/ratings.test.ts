import { describe, expect, it } from "vitest";
import { aggregateRatings, ratingDistribution } from "@/lib/ratings";

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
