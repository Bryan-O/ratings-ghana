"use server";

import { revalidatePath } from "next/cache";
import { uniqueSlug } from "@/lib/business-slug";
import { REJECTION_REASONS } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { businessSchema, fieldErrors } from "@/lib/validation";
import { guard } from "@/lib/actions/guard";
import { formValues, type ActionState } from "@/lib/actions/state";
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

function revalidateListings(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/businesses");
  revalidatePath("/my-submissions");
  revalidatePath("/");
  if (slug) revalidatePath(`/businesses/${slug}`);
}

export async function approveBusinessAction(formData: FormData) {
  await requireAdmin();
  // Only pending listings can be approved (so a stale admin tab can't resurrect a rejected one).
  const { count } = await prisma.business.updateMany({
    where: { id: id(formData), status: "PENDING" },
    data: { status: "APPROVED", reviewedAt: new Date(), rejectionReason: null },
  });
  if (count === 0) return;
  const b = await prisma.business.findUnique({ where: { id: id(formData) }, select: { slug: true } });
  revalidateListings(b?.slug);
}

/** Reject with a reason the submitter can see on "My submissions". */
export async function rejectBusinessAction(formData: FormData) {
  await requireAdmin();
  const reason = String(formData.get("reason") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 300);
  const base = (REJECTION_REASONS as readonly string[]).includes(reason) ? reason : "Other";
  const rejectionReason = base === "Other" ? note || "Other" : note ? `${base}. ${note}` : base;
  await prisma.business.updateMany({
    where: { id: id(formData), status: "PENDING" },
    data: { status: "REJECTED", reviewedAt: new Date(), rejectionReason },
  });
  revalidateListings();
}

const EDIT_FIELDS = ["name", "type", "category", "description", "address", "city", "region", "website", "phone"];

/** Let an admin correct a pending listing (typos, category, links) before deciding. */
export async function updatePendingBusinessAction(prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard("updatePendingBusiness", async (_prev, fd) => {
    const user = await getCurrentUser();
    if (user?.role !== "ADMIN") return { errors: { form: "Only admins can edit listings." } };

    const values = formValues(fd, EDIT_FIELDS);
    const businessId = String(fd.get("id") ?? "");
    const existing = businessId ? await prisma.business.findUnique({ where: { id: businessId } }) : null;
    if (!existing || existing.status !== "PENDING") {
      return { errors: { form: "This listing is no longer pending." }, values };
    }

    const parsed = businessSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
    const b = parsed.data;

    // Clear fields that don't apply to the chosen type.
    const data = {
      ...b,
      address: b.type === "PHYSICAL" ? (b.address ?? null) : null,
      city: b.type === "PHYSICAL" ? (b.city ?? null) : null,
      region: b.type === "PHYSICAL" ? (b.region ?? null) : null,
      website: b.website ?? null,
      phone: b.phone ?? null,
    };
    const nameOrCityChanged = b.name !== existing.name || (data.city ?? null) !== existing.city;
    const slug = nameOrCityChanged
      ? await uniqueSlug(slugify([b.name, data.city].filter(Boolean).join(" ")), existing.id)
      : existing.slug;

    const approve = fd.get("intent") === "approve";
    await prisma.business.update({
      where: { id: existing.id },
      data: { ...data, slug, ...(approve ? { status: "APPROVED", reviewedAt: new Date(), rejectionReason: null } : {}) },
    });
    revalidateListings(slug);
    return { ok: true, message: approve ? "Saved and approved." : "Changes saved." };
  })(prev, formData);
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
