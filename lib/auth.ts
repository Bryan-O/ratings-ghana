import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

class InvalidLogin extends CredentialsSignin {
  code = "invalid_credentials";
}
class EmailNotVerified extends CredentialsSignin {
  code = "email_not_verified";
}

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

declare module "next-auth" {
  interface Session {
    user: { id: string; name?: string | null; email?: string | null; image?: string | null };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    ...(googleEnabled ? [Google] : []),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) throw new InvalidLogin();
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        // Compare against a dummy hash when the user doesn't exist so response
        // time doesn't reveal which emails are registered.
        const hash = user?.passwordHash ?? "$2b$10$pdfTl2B4Y1a9I9.d7RSKz./yHmqhNtJT4NG8Qw00CtIKYaIF8sBi2";
        const ok = await bcrypt.compare(password, hash);
        if (!user?.passwordHash || !ok) throw new InvalidLogin();
        if (!user.emailVerified) throw new EmailNotVerified();

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Only accept Google accounts whose email Google has verified.
      if (account?.provider === "google") return profile?.email_verified === true;
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const email = profile.email.toLowerCase();
        const existing = await prisma.user.findUnique({ where: { email } });
        const dbUser = existing
          ? await prisma.user.update({
              where: { id: existing.id },
              data: {
                emailVerified: existing.emailVerified ?? new Date(),
                image: existing.image ?? (profile.picture as string | undefined),
                name: existing.name ?? profile.name,
              },
            })
          : await prisma.user.create({
              data: {
                email,
                name: profile.name,
                image: profile.picture as string | undefined,
                emailVerified: new Date(),
              },
            });
        token.uid = dbUser.id;
      } else if (user?.id) {
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.uid === "string") session.user.id = token.uid;
      return session;
    },
  },
});
