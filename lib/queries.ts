import "server-only";
import { PAGE_SIZE } from "@/lib/constants";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

export type BusinessSearch = {
  q?: string;
  location?: string;
  category?: string;
  type?: "PHYSICAL" | "ONLINE";
  page?: number;
};

export async function searchBusinesses({ q, location, category, type, page = 1 }: BusinessSearch) {
  const and: Prisma.BusinessWhereInput[] = [{ status: "APPROVED" }];
  if (q) {
    and.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (location) {
    and.push({
      OR: [
        { city: { contains: location, mode: "insensitive" } },
        { region: { contains: location, mode: "insensitive" } },
        { address: { contains: location, mode: "insensitive" } },
      ],
    });
  }
  if (category) and.push({ category });
  if (type) and.push({ type });

  const where = { AND: and };
  const [items, total] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy: [{ reviewCount: "desc" }, { avgRating: "desc" }, { name: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.business.count({ where }),
  ]);
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function getPopularBusinesses(take: number) {
  return prisma.business.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ reviewCount: "desc" }, { avgRating: "desc" }],
    take,
  });
}

export function getBusinessBySlug(slug: string) {
  return prisma.business.findUnique({ where: { slug } });
}

export function getPublishedReviews(businessId: string) {
  return prisma.review.findMany({
    where: { businessId, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
    take: 100,
  });
}

export function getUserReview(userId: string, businessId: string) {
  return prisma.review.findUnique({ where: { userId_businessId: { userId, businessId } } });
}
