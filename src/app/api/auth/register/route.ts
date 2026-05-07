import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  role: z.enum(["STUDENT", "TEACHER", "PARENT"]),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    const existingUser = await db.user.findUnique({
      where: { email: data.email }
    })
    if (existingUser) {
      return NextResponse.json({ error: "هذا البريد الإلكتروني مستخدم بالفعل" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Get initials for avatar
    const initials = data.name.split(" ").map(w => w[0]).join("").slice(0, 2)

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        avatar: initials,
      }
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "حدث خطأ أثناء التسجيل" }, { status: 500 })
  }
}
