"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SetupPage() {
  const [status, setStatus] = useState<"loading" | "no-db" | "db-ready" | "error">("loading")
  const [seedResult, setSeedResult] = useState<string>("")

  useEffect(() => {
    checkDatabase()
  }, [])

  async function checkDatabase() {
    try {
      const res = await fetch("/api/seed")
      const data = await res.json()

      if (data.message && data.message.includes("موجودة")) {
        setStatus("db-ready")
      } else if (data.counts) {
        setStatus("db-ready")
        setSeedResult(`تم إنشاء ${data.counts.subjects} مادة، ${data.counts.lessons} درس`)
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            نبغ
          </h1>
          <p className="text-gray-500 dark:text-gray-400">إعداد قاعدة البيانات</p>
        </div>

        {status === "loading" && (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">جاري التحقق من قاعدة البيانات...</p>
            </CardContent>
          </Card>
        )}

        {status === "db-ready" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">قاعدة البيانات جاهزة!</CardTitle>
              <CardDescription>{seedResult || "قاعدة البيانات متصلة وتحتوي على بيانات"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = "/login"} className="w-full">
                تسجيل الدخول
              </Button>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                <p><strong>حساب تجريبي:</strong></p>
                <p>البريد: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">ahmed@test.com</code></p>
                <p>كلمة المرور: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">123456</code></p>
              </div>
            </CardContent>
          </Card>
        )}

        {(status === "error" || status === "no-db") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">لا يمكن الاتصال بقاعدة البيانات</CardTitle>
              <CardDescription>يجب إعداد قاعدة بيانات PostgreSQL لعمل التطبيق على Vercel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTitle>السبب</AlertTitle>
                <AlertDescription>
                  SQLite لا يعمل على منصات السحابة مثل Vercel لأن الملفات تتعدم مع كل طلب. يجب استخدام PostgreSQL.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">خطوات الإعداد (مجاني - دقيقتين فقط):</h3>

                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium text-indigo-600">الخيار 1: Neon (الأسهل)</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>اذهب إلى <a href="https://neon.tech" target="_blank" className="text-indigo-600 underline">neon.tech</a> وسجل مجاناً</li>
                    <li>أنشئ مشروع جديد باسم &quot;nabgh&quot;</li>
                    <li>انسخ رابط الاتصال من Dashboard</li>
                    <li>في Vercel: Settings → Environment Variables → أضف DATABASE_URL</li>
                    <li>أضف نفس الرابط كـ DIRECT_URL أيضاً</li>
                    <li>Redeploy المشروع</li>
                  </ol>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <h4 className="font-medium text-blue-600">الخيار 2: Vercel Postgres (من Vercel مباشرة)</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>افتح مشروعك في Vercel Dashboard</li>
                    <li>اذهب إلى تبويب &quot;Storage&quot;</li>
                    <li>اختر &quot;Create Database&quot; ثم &quot;Postgres&quot;</li>
                    <li>سيتم إعداد DATABASE_URL تلقائياً</li>
                    <li>Redeploy المشروع</li>
                  </ol>
                </div>
              </div>

              <Button onClick={checkDatabase} variant="outline" className="w-full">
                إعادة المحاولة بعد الإعداد
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
