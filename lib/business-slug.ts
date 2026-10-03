import "server-only";
import { prisma } from "@/lib/db";

/** First free slug based on `base` (appending -2, -3 …). `excludeId` lets a business keep its own slug. */
export async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = base || "business";
  for (let i = 1; i < 100; i++) {
    const slug = i === 1 ? root : `${root}-${i}`;
    const taken = await prisma.business.findUnique({ where: { slug }, select: { id: true } });
    if (!taken || taken.id === excludeId) return slug;
  }
  return `${root}-${Date.now()}`;
}
