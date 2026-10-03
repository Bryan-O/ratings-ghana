"use server";

import { createHmac } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { feedbackEnabled } from "@/lib/features";
import { getCurrentUser } from "@/lib/session";
import { feedbackSchema, fieldErrors } from "@/lib/validation";
import { guard } from "@/lib/actions/guard";
import { formValues, type ActionState } from "@/lib/actions/state";

const PER_HOUR_LIMIT = 10;

function hashIp(ip: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET ?? "dev").update(`feedback:${ip}`).digest("hex").slice(0, 32);
}

export async function submitFeedbackAction(prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard("submitFeedback", _submitFeedback)(prev, formData);
}

async function _submitFeedback(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!feedbackEnabled) return { errors: { form: "Feedback is closed right now." } };

  // Honeypot: real people never see or fill this field.
  if (String(formData.get("company") ?? "") !== "") return { ok: true, message: "Thanks!" };

  const values = formValues(formData, ["type", "message", "email"]);
  const parsed = feedbackSchema.safeParse({
    type: formData.get("type") ?? undefined,
    message: formData.get("message") ?? "",
    email: formData.get("email") ?? "",
    path: formData.get("path") ?? "/",
    viewport: formData.get("viewport") ?? undefined,
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = hashIp(ip);
  const user = await getCurrentUser();

  const recent = await prisma.feedback.count({
    where: {
      createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) },
      OR: [{ ipHash }, ...(user ? [{ userId: user.id }] : [])],
    },
  });
  if (recent >= PER_HOUR_LIMIT) {
    return { errors: { form: "You've sent a lot of feedback this hour — thank you! Please try again a bit later." }, values };
  }

  await prisma.feedback.create({
    data: {
      ...parsed.data,
      email: parsed.data.email ?? (user ? user.email : null),
      userAgent: h.get("user-agent")?.slice(0, 400) ?? null,
      userId: user?.id ?? null,
      ipHash,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/feedback");
  return { ok: true, message: "Thanks! Your feedback was sent." };
}

/** Admin: mark feedback resolved / reopen it. */
export async function setFeedbackStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") throw new Error("Forbidden");
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status") === "RESOLVED" ? "RESOLVED" : "NEW";
  if (!id) throw new Error("Missing id");
  await prisma.feedback.update({
    where: { id },
    data: { status, resolvedAt: status === "RESOLVED" ? new Date() : null },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/feedback");
}
