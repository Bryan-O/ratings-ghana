import "server-only";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/**
 * The signed-in user, read fresh from the database on every request so that
 * verification status and role can never be stale or forged via the JWT.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      phone: true,
      phoneVerifiedAt: true,
      role: true,
    },
  });
});

export type VerificationStep = "login" | "verify-email" | "verify-phone" | null;

/** What a user still has to do before they may post reviews (null = nothing). */
export function nextVerificationStep(
  user: Pick<CurrentUser, "emailVerified" | "phone" | "phoneVerifiedAt"> | null,
): VerificationStep {
  if (!user) return "login";
  if (!user.emailVerified) return "verify-email";
  if (!user.phone || !user.phoneVerifiedAt) return "verify-phone";
  return null;
}
