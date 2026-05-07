import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const userId = (session?.user as any)?.id

    const subjects = await db.subject.findMany({
      orderBy: { order: "asc" },
      include: {
        lessons: {
          select: { id: true },
        },
        _count: {
          select: { lessons: true },
        },
      },
    })

    // If user is authenticated, get their progress for each subject
    let userProgress: any[] = []
    if (userId) {
      userProgress = await db.userProgress.findMany({
        where: { userId },
        include: { lesson: { select: { subjectId: true } } },
      })
    }

    const subjectsWithProgress = subjects.map(subject => {
      const lessonCount = subject._count.lessons
      let completedCount = 0
      let inProgressCount = 0

      if (userId) {
        const subjectProgress = userProgress.filter(
          (p: any) => p.lesson.subjectId === subject.id
        )
        completedCount = subjectProgress.filter(
          (p: any) => p.status === "COMPLETED"
        ).length
        inProgressCount = subjectProgress.filter(
          (p: any) => p.status === "IN_PROGRESS"
        ).length
      }

      return {
        id: subject.id,
        name: subject.name,
        icon: subject.icon,
        color: subject.color,
        order: subject.order,
        lessonCount,
        completedCount,
        inProgressCount,
        progress: lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0,
      }
    })

    return NextResponse.json(subjectsWithProgress)
  } catch (error: any) {
    console.error("Subjects fetch error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب المواد" }, { status: 500 })
  }
}
