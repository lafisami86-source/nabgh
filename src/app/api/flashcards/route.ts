import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const flashcards = await db.flashcard.findMany({
      where: { userId: null },
      take: 20,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(flashcards)
  } catch (error: any) {
    console.error("Flashcards fetch error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء جلب البطاقات" }, { status: 500 })
  }
}
