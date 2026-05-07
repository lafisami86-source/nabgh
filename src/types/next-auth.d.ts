import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "STUDENT" | "TEACHER" | "PARENT"
      avatar: string | null
      plan: "FREE" | "PREMIUM" | "FAMILY"
      streak: number
      xp: number
      level: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "STUDENT" | "TEACHER" | "PARENT"
    avatar: string | null
    plan: "FREE" | "PREMIUM" | "FAMILY"
    streak: number
    xp: number
    level: number
  }
}
