import "server-only";
import { PAGE_SIZE } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { nameTokens, rankDuplicates, websiteKey } from "@/lib/duplicates";
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

export async function getCategoryCounts() {
  const rows = await prisma.business.groupBy({
    by: ["category"],
    where: { status: "APPROVED" },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.category, r._count._all]));
}

export function getRecentReviews(take: number) {
  return prisma.review.findMany({
    where: { status: "PUBLISHED", business: { status: "APPROVED" } },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      user: { select: { name: true } },
      business: { select: { name: true, slug: true, category: true } },
    },
  });
}

export async function getSiteStats() {
  const [businesses, reviews] = await Promise.all([
    prisma.business.count({ where: { status: "APPROVED" } }),
    prisma.review.count({ where: { status: "PUBLISHED" } }),
  ]);
  return { businesses, reviews };
}

export function getApprovedPhotos(businessId: string) {
  return prisma.businessPhoto.findMany({
    where: { businessId, status: "APPROVED" },
    orderBy: { reviewedAt: "asc" },
    include: { uploader: { select: { name: true } } },
  });
}

export function countMyPendingPhotos(userId: string, businessId: string) {
  return prisma.businessPhoto.count({ where: { uploaderId: userId, businessId, status: "PENDING" } });
}

export function getPendingPhotos() {
  return prisma.businessPhoto.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      business: { select: { name: true, slug: true } },
      uploader: { select: { name: true, email: true } },
    },
  });
}

/**
 * Pending businesses for the admin queue, each with its submitter's track record
 * and likely duplicates among existing (non-rejected) listings.
 */
export async function getModerationQueue() {
  const pending = await prisma.business.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      submittedBy: { select: { id: true, name: true, email: true, createdAt: true, phoneVerifiedAt: true } },
    },
  });
  if (pending.length === 0) return [];

  const submitterIds = [...new Set(pending.map((b) => b.submittedById).filter((x): x is string => Boolean(x)))];
  const history = await prisma.business.groupBy({
    by: ["submittedById", "status"],
    where: { submittedById: { in: submitterIds } },
    _count: { _all: true },
  });
  const statsFor = (userId: string | null) => {
    const rows = history.filter((h) => h.submittedById === userId);
    const n = (s: string) => rows.find((r) => r.status === s)?._count._all ?? 0;
    return { approved: n("APPROVED"), rejected: n("REJECTED"), pending: n("PENDING") };
  };

  return Promise.all(
    pending.map(async (b) => {
      const tokens = nameTokens(b.name).filter((t) => t.length >= 3);
      const key = websiteKey(b.website);
      const or: Prisma.BusinessWhereInput[] = tokens.map((t) => ({ name: { contains: t, mode: "insensitive" as const } }));
      if (key) or.push({ website: { contains: key.split("/").pop()!, mode: "insensitive" } });
      const candidates = or.length
        ? await prisma.business.findMany({
            where: { id: { not: b.id }, status: { not: "REJECTED" }, OR: or },
            select: { id: true, name: true, slug: true, status: true, website: true, city: true },
            take: 25,
          })
        : [];
      return { ...b, submitterStats: statsFor(b.submittedById), duplicates: rankDuplicates(b, candidates) };
    }),
  );
}

/** Everything a user has suggested, newest first (for "My submissions"). */
export function getMySubmissions(userId: string) {
  return prisma.business.findMany({
    where: { submittedById: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug: true, category: true, type: true, status: true, rejectionReason: true, createdAt: true, reviewedAt: true },
  });
}

export function countMySubmissions(userId: string) {
  return prisma.business.count({ where: { submittedById: userId } });
}

export function getFeedback(status: "NEW" | "RESOLVED" | "ALL") {
  return prisma.feedback.findMany({
    where: status === "ALL" ? {} : { status },
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { user: { select: { name: true, email: true } } },
  });
}

export async function getFeedbackCounts() {
  const rows = await prisma.feedback.groupBy({ by: ["status"], _count: { _all: true } });
  const n = (s: string) => rows.find((r) => r.status === s)?._count._all ?? 0;
  return { NEW: n("NEW"), RESOLVED: n("RESOLVED"), ALL: n("NEW") + n("RESOLVED") };
}
