"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PHOTO_UPLOADS_PER_DAY } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { ImageError, MAX_UPLOAD_BYTES, processImage } from "@/lib/images";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";
import { deleteStoredImage, storeImage } from "@/lib/storage";
import type { ActionState } from "@/lib/actions/state";

const uploadSchema = z.object({
  businessId: z.string().min(1),
  caption: z
    .string()
    .trim()
    .max(140, "Captions can be up to 140 characters")
    .optional()
    .transform((v) => v || undefined),
  rights: z.literal("on", { error: "Please confirm you took this photo or have permission to share it." }),
});

/** Upload one photo (one per request keeps us under the platform body-size limit). */
export async function uploadPhotoAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || nextVerificationStep(user)) {
    return { errors: { form: "Verify your account before adding photos." } };
  }

  const parsed = uploadSchema.safeParse({
    businessId: formData.get("businessId"),
    caption: formData.get("caption") ?? undefined,
    rights: formData.get("rights"),
  });
  if (!parsed.success) return { errors: { form: parsed.error.issues[0]?.message ?? "Invalid upload." } };
  const { businessId, caption } = parsed.data;

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return { errors: { form: "Choose a photo to upload." } };
  if (file.size > MAX_UPLOAD_BYTES) return { errors: { form: "Photos must be 4 MB or smaller." } };

  const business = await prisma.business.findUnique({ where: { id: businessId }, select: { status: true, slug: true } });
  if (!business || business.status !== "APPROVED") return { errors: { form: "This business isn't accepting photos." } };

  const today = await prisma.businessPhoto.count({
    where: { uploaderId: user.id, createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });
  if (today >= PHOTO_UPLOADS_PER_DAY) {
    return { errors: { form: `You can upload up to ${PHOTO_UPLOADS_PER_DAY} photos a day. Please try again tomorrow.` } };
  }

  let processed;
  try {
    processed = await processImage(Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    if (e instanceof ImageError) return { errors: { form: e.message } };
    throw e;
  }

  const stored = await storeImage(businessId, processed.data);
  try {
    await prisma.businessPhoto.create({
      data: {
        businessId,
        uploaderId: user.id,
        url: stored.url,
        storageKey: stored.key,
        width: processed.width,
        height: processed.height,
        caption,
      },
    });
  } catch (e) {
    await deleteStoredImage(stored.key).catch(() => {});
    throw e;
  }

  revalidatePath(`/businesses/${business.slug}`);
  revalidatePath("/admin");
  return { ok: true, message: "Sent for review" };
}

// --- Moderation (admin only) ---

async function requireAdmin() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
}

function photoId(formData: FormData): string {
  const v = String(formData.get("id") ?? "");
  if (!v) throw new Error("Missing id");
  return v;
}

function revalidateBusiness(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/businesses");
  revalidatePath("/");
  revalidatePath(`/businesses/${slug}`);
  revalidatePath(`/businesses/${slug}/photos`);
}

export async function approvePhotoAction(formData: FormData) {
  await requireAdmin();
  const id = photoId(formData);
  const slug = await prisma.$transaction(async (tx) => {
    // Only PENDING photos can be approved, so a double click can't add the URL twice.
    const { count } = await tx.businessPhoto.updateMany({
      where: { id, status: "PENDING" },
      data: { status: "APPROVED", reviewedAt: new Date() },
    });
    const photo = await tx.businessPhoto.findUniqueOrThrow({ where: { id }, include: { business: { select: { slug: true } } } });
    if (count === 1) {
      await tx.business.update({ where: { id: photo.businessId }, data: { images: { push: photo.url } } });
    }
    return photo.business.slug;
  });
  revalidateBusiness(slug);
}

/** Reject a pending photo or take down an approved one; the stored file is deleted. */
export async function removePhotoAction(formData: FormData) {
  await requireAdmin();
  const id = photoId(formData);
  const photo = await prisma.$transaction(async (tx) => {
    const p = await tx.businessPhoto.findUniqueOrThrow({
      where: { id },
      include: { business: { select: { slug: true, images: true } } },
    });
    if (p.status === "REJECTED") return p;
    await tx.businessPhoto.update({ where: { id }, data: { status: "REJECTED", reviewedAt: new Date() } });
    if (p.status === "APPROVED") {
      await tx.business.update({
        where: { id: p.businessId },
        data: { images: p.business.images.filter((u) => u !== p.url) },
      });
    }
    return p;
  });
  await deleteStoredImage(photo.storageKey).catch((e) => console.error("Failed to delete photo file", e));
  revalidateBusiness(photo.business.slug);
}
