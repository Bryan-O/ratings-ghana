import "server-only";
import type { Prisma } from "@/lib/generated/prisma/client";

/** Recompute a business's cached rating. Call inside the same transaction as the review write. */
export async function recomputeBusinessRating(tx: Prisma.TransactionClient, businessId: string) {
  const agg = await tx.review.aggregate({
    where: { businessId, status: "PUBLISHED" },
    _avg: { rating: true },
    _count: { _all: true },
  });
  await tx.business.update({
    where: { id: businessId },
    data: {
      avgRating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count._all,
    },
  });
}
