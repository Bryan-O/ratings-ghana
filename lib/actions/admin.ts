"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { recomputeBusinessRating } from "@/lib/ratings-db";
import { getCurrentUser } from "@/lib/session";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

function id(formData: FormData): string {
  const v = String(formData.get("id") ?? "");
  if (!v) throw new Error("Missing id");
  return v;
}

export async function approveBusinessAction(formData: FormData) {
  await requireAdmin();
  await prisma.business.update({ where: { id: id(formData) }, data: { status: "APPROVED" } });
  revalidatePath("/admin");
  revalidatePath("/businesses");
}

export async function rejectBusinessAction(formData: FormData) {
  await requireAdmin();
  await prisma.business.update({ where: { id: id(formData) }, data: { status: "REJECTED" } });
  revalidatePath("/admin");
}

export async function hideReviewAction(formData: FormData) {
  await requireAdmin();
  const reviewId = id(formData);
  const review = await prisma.$transaction(async (tx) => {
    const r = await tx.review.update({
      where: { id: reviewId },
      data: { status: "HIDDEN" },
      select: { businessId: true, business: { select: { slug: true } } },
    });
    await tx.report.updateMany({ where: { reviewId, resolvedAt: null }, data: { resolvedAt: new Date() } });
    await recomputeBusinessRating(tx, r.businessId);
    return r;
  });
  revalidatePath("/admin");
  revalidatePath(`/businesses/${review.business.slug}`);
}

export async function dismissReportsAction(formData: FormData) {
  await requireAdmin();
  await prisma.report.updateMany({ where: { reviewId: id(formData), resolvedAt: null }, data: { resolvedAt: new Date() } });
  revalidatePath("/admin");
}
