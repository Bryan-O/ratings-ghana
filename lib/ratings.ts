export type RatingAggregate = { avgRating: number; reviewCount: number };

export function aggregateRatings(ratings: number[]): RatingAggregate {
  if (ratings.length === 0) return { avgRating: 0, reviewCount: 0 };
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return {
    avgRating: Math.round((sum / ratings.length) * 10) / 10,
    reviewCount: ratings.length,
  };
}

/** Counts per star value, index 0 = 1 star ... index 4 = 5 stars. */
export function ratingDistribution(ratings: number[]): number[] {
  const dist = [0, 0, 0, 0, 0];
  for (const r of ratings) if (r >= 1 && r <= 5) dist[r - 1]++;
  return dist;
}

/** Plain-word label shown under a business's score ("Excellent" … "Bad"). */
export function ratingLabel(avg: number, count: number): string {
  if (count === 0) return "No rating yet";
  if (avg >= 4.5) return "Excellent";
  if (avg >= 3.5) return "Good";
  if (avg >= 2.5) return "Okay";
  if (avg >= 1.5) return "Poor";
  return "Bad";
}
