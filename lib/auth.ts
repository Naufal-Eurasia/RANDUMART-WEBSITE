import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  useSecureCookies: false, // Ini tetap dipertahankan (biar lancar di localhost)
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Invalid credentials");
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) throw new Error("Invalid credentials");
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isCorrectPassword) throw new Error("Invalid credentials");
        return { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image };
      }
    })
  ],
  callbacks: {
    // signIn callback: izinkan semua provider masuk.
    // Return false hanya jika ada kondisi eksplisit yang harus ditolak.
    async signIn({ user, account }) {
      // Google provider: pastikan user punya email (requirement Google OAuth)
      if (account?.provider === 'google') {
        return !!user.email;
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Selalu set token.id langsung dari objek user sebagai fallback utama,
        // sebelum DB lookup — mencegah token tanpa id jika query gagal.
        token.id = user.id;
        token.lastChecked = Date.now();

        // Gunakan user.email jika ada, fallback ke token.email (untuk Google OAuth
        // yang kadang melewatkan email di objek user pada pemanggilan berikutnya).
        const emailToLookup = user.email ?? (token.email as string | undefined);
        if (emailToLookup) {
          const dbUser = await prisma.user.findUnique({ where: { email: emailToLookup } });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id; // gunakan id dari DB (lebih andal)
          } else {
            token.role = 'CUSTOMER';
          }
        } else {
          token.role = 'CUSTOMER';
        }
      }

      // Periodic revalidation (1 min for ADMIN, 10 mins for others)
      const now = Date.now();
      const lastChecked = (token.lastChecked as number) || 0;
      const revalTime = token.role === 'ADMIN' ? 60 * 1000 : 10 * 60 * 1000;
      if (now - lastChecked > revalTime && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email as string } });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
          token.lastChecked = now;
          delete token.error;
        } else {
          token.error = "UserDeleted";
          token.role = 'CUSTOMER';
          token.lastChecked = now;
        }
      }

      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email as string } });
        if (dbUser) {
          token.role = dbUser.role;
        } else {
          token.error = "UserDeleted";
          token.role = 'CUSTOMER';
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        if (token.error) {
          (session as any).error = token.error;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};