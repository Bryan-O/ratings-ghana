"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";
import { slugify } from "@/lib/slug";
import { businessSchema, fieldErrors } from "@/lib/validation";
import { formValues, type ActionState } from "@/lib/actions/state";
import { guard } from "@/lib/actions/guard";

const MAX_PENDING_PER_USER = 5;
const FIELDS = ["name", "type", "category", "description", "address", "city", "region", "website", "phone"];

async function uniqueSlug(base: string): Promise<string> {
  const root = base || "business";
  for (let i = 1; i < 100; i++) {
    const slug = i === 1 ? root : `${root}-${i}`;
    if (!(await prisma.business.findUnique({ where: { slug }, select: { id: true } }))) return slug;
  }
  return `${root}-${Date.now()}`;
}

export async function suggestBusinessAction(prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard("suggestBusiness", _suggestBusiness)(prev, formData);
}

async function _suggestBusiness(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData, FIELDS);
  const user = await getCurrentUser();
  if (!user || nextVerificationStep(user)) {
    return { errors: { form: "Verify your account before adding a business." }, values };
  }

  const parsed = businessSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const b = parsed.data;

  const pending = await prisma.business.count({ where: { submittedById: user.id, status: "PENDING" } });
  if (pending >= MAX_PENDING_PER_USER) {
    return { errors: { form: "You have several businesses waiting for review. Please wait for them to be approved." }, values };
  }

  const duplicate = await prisma.business.findFirst({
    where: {
      name: { equals: b.name, mode: "insensitive" },
      status: { not: "REJECTED" },
      ...(b.city ? { city: { equals: b.city, mode: "insensitive" } } : {}),
    },
    select: { slug: true, status: true },
  });
  if (duplicate) {
    return {
      errors: {
        name: duplicate.status === "APPROVED"
          ? "This business is already listed."
          : "This business has already been suggested and is awaiting review.",
      },
      values,
      data: duplicate.status === "APPROVED" ? { duplicateSlug: duplicate.slug } : undefined,
    };
  }

  await prisma.business.create({
    data: {
      ...b,
      slug: await uniqueSlug(slugify([b.name, b.city].filter(Boolean).join(" "))),
      status: "PENDING",
      submittedById: user.id,
    },
  });

  return { ok: true, message: "Thanks! We'll review this business and publish it soon." };
}
