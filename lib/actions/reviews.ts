"use server";

import { revalidatePath } from "next/cache";
import { REVIEWS_PER_DAY_LIMIT } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { isUniqueViolation } from "@/lib/prisma-errors";
import { recomputeBusinessRating } from "@/lib/ratings-db";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";
import { fieldErrors, reportSchema, reviewSchema } from "@/lib/validation";
import { formValues, type ActionState } from "@/lib/actions/state";

const STEP_MESSAGES = {
  login: "Log in to write a review.",
  "verify-email": "Verify your email address before writing a review.",
  "verify-phone": "Verify your phone number before writing a review.",
} as const;

export async function submitReviewAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData, ["rating", "title", "body"]);
  const user = await getCurrentUser();
  const step = nextVerificationStep(user);
  if (step || !user) return { errors: { form: STEP_MESSAGES[step ?? "login"] }, values };

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const { businessId, rating, title, body } = parsed.data;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true, slug: true, status: true, submittedById: true },
  });
  if (!business || business.status !== "APPROVED") {
    return { errors: { form: "This business isn't accepting reviews." }, values };
  }
  if (business.submittedById === user.id) {
    return { errors: { form: "You can't review a business you added to RatingsGhana." }, values };
  }

  const existing = await prisma.review.findUnique({
    where: { userId_businessId: { userId: user.id, businessId } },
    select: { id: true },
  });

  if (!existing) {
    const today = await prisma.review.count({
      where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    });
    if (today >= REVIEWS_PER_DAY_LIMIT) {
      return { errors: { form: `You can post up to ${REVIEWS_PER_DAY_LIMIT} reviews a day. Please come back tomorrow.` }, values };
    }
  }

  await prisma.$transaction(async (tx) => {
    // Editing keeps the existing status so hidden reviews stay hidden.
    await tx.review.upsert({
      where: { userId_businessId: { userId: user.id, businessId } },
      create: { userId: user.id, businessId, rating, title, body },
      update: { rating, title, body },
    });
    await recomputeBusinessRating(tx, businessId);
  });

  revalidatePath(`/businesses/${business.slug}`);
  revalidatePath("/businesses");
  return { ok: true, message: existing ? "Your review has been updated." : "Thanks! Your review is live." };
}

export async function reportReviewAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user?.emailVerified) return { errors: { form: "Log in to report a review." } };

  const parsed = reportSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const review = await prisma.review.findUnique({ where: { id: parsed.data.reviewId }, select: { userId: true } });
  if (!review) return { errors: { form: "Review not found." } };
  if (review.userId === user.id) return { errors: { form: "You can't report your own review." } };

  try {
    await prisma.report.create({ data: { reviewId: parsed.data.reviewId, userId: user.id, reason: parsed.data.reason } });
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: true, message: "You've already reported this review." };
    throw e;
  }
  return { ok: true, message: "Thanks — our team will take a look." };
}
