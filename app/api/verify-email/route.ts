import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashToken } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const loginUrl = new URL("/login", request.url);

  const record = token
    ? await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) } })
    : null;

  if (!record || record.expiresAt < new Date()) {
    loginUrl.searchParams.set("verified", "invalid");
    return NextResponse.redirect(loginUrl);
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: record.userId } }),
  ]);

  loginUrl.searchParams.set("verified", "1");
  return NextResponse.redirect(loginUrl);
}
