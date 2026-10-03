"use server";

import bcrypt from "bcryptjs";
import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { appUrl, sendVerificationEmail } from "@/lib/email";
import { generateToken, hashToken } from "@/lib/tokens";
import { fieldErrors, loginSchema, registerSchema } from "@/lib/validation";
import { formValues, safeNext, type ActionState } from "@/lib/actions/state";

const EMAIL_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_VERIFICATION_EMAILS_PER_HOUR = 3;

async function issueEmailVerification(userId: string, email: string): Promise<boolean> {
  const recent = await prisma.emailVerificationToken.count({
    where: { userId, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
  });
  if (recent >= MAX_VERIFICATION_EMAILS_PER_HOUR) return false;

  const token = generateToken();
  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + EMAIL_TOKEN_TTL_MS) },
  });
  await sendVerificationEmail(email, `${appUrl()}/api/verify-email?token=${token}`);
  return true;
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData, ["name", "email"]);
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.emailVerified) {
    return { errors: { email: "An account with this email already exists. Log in instead." }, values };
  }

  if (existing) {
    // Unverified account: don't let a second sign-up overwrite the password,
    // just resend the link to the inbox owner.
    await issueEmailVerification(existing.id, email);
  } else {
    const user = await prisma.user.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, 10) },
    });
    await issueEmailVerification(user.id, email);
  }

  redirect(`/register/check-email?email=${encodeURIComponent(email)}`);
}

export async function resendVerificationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (user && !user.emailVerified && user.passwordHash) {
    const sent = await issueEmailVerification(user.id, email);
    if (!sent) return { message: "Too many emails sent. Please wait an hour and try again." };
  }
  // Same response whether or not the account exists.
  return { ok: true, message: "If that account needs verifying, we've sent a new link." };
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData, ["email"]);
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: safeNext(formData.get("next")),
    });
  } catch (e) {
    if (e instanceof CredentialsSignin && e.code === "email_not_verified") {
      return {
        errors: { form: "Please verify your email first. Check your inbox for the link we sent." },
        values,
        data: { unverifiedEmail: parsed.data.email },
      };
    }
    if (e instanceof AuthError) {
      return { errors: { form: "Incorrect email or password." }, values };
    }
    throw e; // NEXT_REDIRECT on success
  }
  return {};
}

export async function googleSignInAction(formData: FormData) {
  await signIn("google", { redirectTo: safeNext(formData.get("next")) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
