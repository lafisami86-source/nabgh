import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession()
    const userId = (session?.user as any)?.id

    const subject = await db.subject.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: {
            _count: {
              select: { exercises: true },
            },
          },
        },
      },
    })

    if (!subject) {
      return NextResponse.json({ error: "المادة غير موجودة" }, { status: 404 })
    }

    // If user is authenticated, get their progress for lessons
    let userProgress: any[] = []
    if (userId) {
      userProgress = await db.userProgress.findMany({
        where: {
          userId,
          lessonId: { in: subject.lessons.map(l => l.id) },
        },
      })
    }

    const lessonsWithProgress = subject.lessons.map(lesson => {
      const progress = userProgress.find((p: any) => p.lessonId === lesson.id)
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        difficulty: lesson.difficulty,
        duration: lesson.duration,
        exerciseCount: lesson._count.exercises,
        status: progress?.status || "NOT_STARTED",
        score: progress?.score || 0,
        timeSpent: progress?.timeSpent || 0,
      }
    })

    return NextResponse.json({
      id: subject.id,
      name: subject.name,
      icon: subject.icon,
      color: subject.color,
      lessons: lessonsWithProgress,
    })
  } catch (error: any) {
    console.error("Lessons fetch error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الدروس" }, { status: 500 })
  }
}
