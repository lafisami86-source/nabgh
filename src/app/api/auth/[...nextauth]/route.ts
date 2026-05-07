import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان")
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user || !user.password) {
          throw new Error("لا يوجد حساب بهذا البريد الإلكتروني")
        }
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("كلمة المرور غير صحيحة")
        }
        return { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, plan: user.plan, streak: user.streak, xp: user.xp, level: user.level }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.avatar = (user as any).avatar
        token.plan = (user as any).plan
        token.streak = (user as any).streak
        token.xp = (user as any).xp
        token.level = (user as any).level
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).avatar = token.avatar
        ;(session.user as any).plan = token.plan
        ;(session.user as any).streak = token.streak
        ;(session.user as any).xp = token.xp
        ;(session.user as any).level = token.level
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "nabgh-secret-key-change-in-production",
})

export { handler as GET, handler as POST }
