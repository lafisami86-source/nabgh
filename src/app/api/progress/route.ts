import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { z } from "zod"

// GET: Return user's progress across all lessons
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 })
    }

    const userId = (session.user as any).id

    const progress = await db.userProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            subject: {
              select: { id: true, name: true, icon: true, color: true },
            },
          },
        },
      },
      orderBy: { completedAt: { sort: "desc", nulls: "last" } },
    })

    const stats = {
      totalLessons: progress.length,
      completed: progress.filter(p => p.status === "COMPLETED").length,
      inProgress: progress.filter(p => p.status === "IN_PROGRESS").length,
      notStarted: progress.filter(p => p.status === "NOT_STARTED").length,
      totalScore: progress.reduce((sum, p) => sum + p.score, 0),
      totalTimeSpent: progress.reduce((sum, p) => sum + p.timeSpent, 0),
    }

    return NextResponse.json({ progress, stats })
  } catch (error: any) {
    console.error("Progress fetch error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب التقدم" }, { status: 500 })
  }
}

const progressSchema = z.object({
  lessonId: z.string(),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
  score: z.number().min(0).max(100).optional(),
  timeSpent: z.number().min(0).optional(),
})

// POST: Create/update progress for a lesson
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await req.json()
    const data = progressSchema.parse(body)

    // Check if lesson exists
    const lesson = await db.lesson.findUnique({
      where: { id: data.lessonId },
    })
    if (!lesson) {
      return NextResponse.json({ error: "الدرس غير موجود" }, { status: 404 })
    }

    // Upsert progress
    const progress = await db.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId: data.lessonId },
      },
      update: {
        ...(data.status && { status: data.status }),
        ...(data.score !== undefined && { score: data.score }),
        ...(data.timeSpent !== undefined && { timeSpent: data.timeSpent }),
        ...(data.status === "COMPLETED" && { completedAt: new Date() }),
      },
      create: {
        userId,
        lessonId: data.lessonId,
        status: data.status || "IN_PROGRESS",
        score: data.score || 0,
        timeSpent: data.timeSpent || 0,
        ...(data.status === "COMPLETED" && { completedAt: new Date() }),
      },
    })

    // Update user XP if completed
    if (data.status === "COMPLETED") {
      const xpGain = data.score
        ? Math.round(data.score / 10) + 10
        : 10

      const currentUser = await db.user.findUnique({ where: { id: userId } })
      if (currentUser) {
        const newXp = currentUser.xp + xpGain
        const newLevel = Math.floor(newXp / 100) + 1
        await db.user.update({
          where: { id: userId },
          data: {
            xp: newXp,
            level: newLevel,
          },
        })
      }
    }

    return NextResponse.json(progress)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error("Progress update error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء تحديث التقدم" }, { status: 500 })
  }
}
