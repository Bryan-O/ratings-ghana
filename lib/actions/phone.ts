"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  OTP_MAX_ATTEMPTS,
  OTP_MAX_SENDS_PER_HOUR,
  OTP_TTL_MS,
  generateOtpCode,
  hashOtpCode,
  otpMatches,
  otpState,
} from "@/lib/otp";
import { maskGhanaPhone, normalizeGhanaPhone } from "@/lib/phone";
import { isUniqueViolation } from "@/lib/prisma-errors";
import { getCurrentUser } from "@/lib/session";
import { sendSms } from "@/lib/sms";
import { safeNext, type ActionState } from "@/lib/actions/state";
import { guard } from "@/lib/actions/guard";

const TAKEN = "This number is already linked to another RatingsGhana account.";

export async function sendPhoneOtpAction(prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard("sendPhoneOtp", _sendPhoneOtp)(prev, formData);
}

async function _sendPhoneOtp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/verify-phone");
  if (!user.emailVerified) return { errors: { form: "Verify your email address first." } };
  if (user.phoneVerifiedAt) return { ok: true, message: "Your phone number is already verified." };

  const raw = String(formData.get("phone") ?? "");
  const phone = normalizeGhanaPhone(raw);
  if (!phone) {
    return { errors: { phone: "Enter a valid Ghana mobile number, e.g. 024 123 4567" }, values: { phone: raw } };
  }

  const taken = await prisma.user.findFirst({ where: { phone, NOT: { id: user.id } }, select: { id: true } });
  if (taken) return { errors: { phone: TAKEN }, values: { phone: raw } };

  const sentLastHour = await prisma.phoneOtp.count({
    where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
  });
  if (sentLastHour >= OTP_MAX_SENDS_PER_HOUR) {
    return { errors: { phone: "Too many codes requested. Please try again in an hour." }, values: { phone: raw } };
  }

  const code = generateOtpCode();
  const otp = await prisma.phoneOtp.create({
    data: {
      userId: user.id,
      phone,
      codeHash: hashOtpCode(code, phone),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });
  try {
    await sendSms(phone, `Your RatingsGhana verification code is ${code}. It expires in 10 minutes. Don't share it with anyone.`);
  } catch (e) {
    // A text that never left doesn't count towards the hourly limit, and its code must not be usable.
    await prisma.phoneOtp.delete({ where: { id: otp.id } }).catch(() => {});
    console.error("[action:sendPhoneOtp] SMS not sent", { to: maskGhanaPhone(phone) }, e);
    return {
      errors: {
        form: "We couldn't send a text to that number. Check it's a Ghana mobile number and try again. If it keeps happening, come back in a few minutes.",
      },
      values: { phone: raw },
    };
  }

  return { ok: true, data: { step: "code", maskedPhone: maskGhanaPhone(phone) } };
}

export async function verifyPhoneOtpAction(prev: ActionState, formData: FormData): Promise<ActionState> {
  return guard("verifyPhoneOtp", _verifyPhoneOtp)(prev, formData);
}

async function _verifyPhoneOtp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/verify-phone");
  const next = safeNext(formData.get("next"));
  const keep = { step: "code", maskedPhone: String(formData.get("maskedPhone") ?? "") };

  const code = String(formData.get("code") ?? "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) return { errors: { code: "Enter the 6-digit code" }, data: keep };

  const otp = await prisma.phoneOtp.findFirst({
    where: { userId: user.id, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  const state = otp ? otpState(otp) : "expired";
  if (!otp || state !== "ok") {
    const msg =
      state === "too_many_attempts"
        ? "Too many wrong attempts. Request a new code."
        : "This code has expired. Request a new code.";
    return { errors: { code: msg }, data: keep };
  }

  if (!otpMatches(code, otp.phone, otp.codeHash)) {
    const updated = await prisma.phoneOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    const left = OTP_MAX_ATTEMPTS - updated.attempts;
    return {
      errors: { code: left > 0 ? `That code is incorrect. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many wrong attempts. Request a new code." },
      data: keep,
    };
  }

  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { phone: otp.phone, phoneVerifiedAt: new Date() } }),
      prisma.phoneOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } }),
    ]);
  } catch (e) {
    if (isUniqueViolation(e)) return { errors: { code: TAKEN }, data: keep };
    throw e;
  }

  redirect(next);
}
