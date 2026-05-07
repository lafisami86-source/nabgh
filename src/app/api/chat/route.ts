import { NextRequest, NextResponse } from "next/server"
import ZAI from "z-ai-web-dev-sdk"

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 })
    }

    const zai = await ZAI.create()

    const messages = [
      {
        role: "system" as const,
        content: `أنت نبوغ 🤖، مساعد تعليمي ذكي في منصة نبغ التعليمية. أنت تساعد الطلاب في فهم الدروس وحل المسائل بطريقة تربوية. قواعدك:
1. لا تعطِ الإجابة مباشرة، بل وجّه الطالب للتفكير
2. استخدم أمثلة بسيطة ومقارنات يومية
3. شجع الطالب عند الإجابة الصحيحة
4. تحدث بالعربية الفصحى المبسطة
5. إذا سأل عن شيء خارج التعليم، اعتذر بلطف`
      },
      ...(history || []).map((m: any) => ({ role: m.role as any, content: m.content })),
      { role: "user" as const, content: message }
    ]

    const completion = await zai.chat.completions.create({ messages })

    return NextResponse.json({ reply: completion.choices[0]?.message?.content || "عذراً، لم أستطع معالجة طلبك" })
  } catch (error: any) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "حدث خطأ في الاتصال بالمساعد الذكي" }, { status: 500 })
  }
}
