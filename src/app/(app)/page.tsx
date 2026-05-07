"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Flame,
  Trophy,
  Star,
  BookOpen,
  Layers,
  ChevronLeft,
  Sparkles,
  Loader2,
  Database,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Subject {
  id: string
  name: string
  icon: string
  color: string
  lessonCount: number
  progress: number
  completedCount: number
  inProgressCount: number
}

interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [noData, setNoData] = useState(false)

  const name = session?.user?.name || "مستخدم"
  const level = session?.user?.level || 1
  const xp = session?.user?.xp || 0
  const streak = session?.user?.streak || 0

  useEffect(() => {
    async function fetchData() {
      try {
        const [subjectsRes, flashcardsRes] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/flashcards"),
        ])

        if (subjectsRes.ok) {
          const subjectsData = await subjectsRes.json()
          setSubjects(subjectsData)
          if (subjectsData.length === 0) setNoData(true)
        }

        if (flashcardsRes.ok) {
          const flashcardsData = await flashcardsRes.json()
          setFlashcards(Array.isArray(flashcardsData) ? flashcardsData.slice(0, 4) : [])
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch("/api/seed")
      const data = await res.json()
      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Seed error:", error)
    } finally {
      setSeeding(false)
    }
  }

  const achievementsCount = 0 // Placeholder
  const completedLessons = subjects.reduce((sum, s) => sum + s.completedCount, 0)
  const totalLessons = subjects.reduce((sum, s) => sum + s.lessonCount, 0)
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            مرحباً، {name} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            استمر في رحلة التعلم اليوم
          </p>
        </div>
        {noData && (
          <Button onClick={handleSeed} disabled={seeding} variant="outline" size="sm">
            {seeding ? (
              <Loader2 className="h-4 w-4 animate-spin ml-1" />
            ) : (
              <Database className="h-4 w-4 ml-1" />
            )}
            إضافة بيانات تجريبية
          </Button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">المستوى</span>
              </div>
              <p className="text-2xl font-bold">{level}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/10 dark:to-violet-800/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-xs text-muted-foreground">النقاط</span>
              </div>
              <p className="text-2xl font-bold">{xp}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-800/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xs text-muted-foreground">السلسلة</span>
              </div>
              <p className="text-2xl font-bold">{streak}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/10 dark:to-amber-800/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs text-muted-foreground">الإنجازات</span>
              </div>
              <p className="text-2xl font-bold">{achievementsCount}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Subject Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                تقدمي في المواد
              </CardTitle>
              <Link href="/subjects">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  الكل
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground mt-2">
                  لا توجد مواد بعد
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {subjects.map((subject, index) => (
                  <Link
                    key={subject.id}
                    href={`/subjects/${subject.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-3 group">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: subject.color + "15" }}
                      >
                        {subject.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{subject.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {subject.completedCount}/{subject.lessonCount} درس
                          </span>
                        </div>
                        <Progress
                          value={subject.progress}
                          className="h-2"
                          style={
                            {
                              "--progress-background": subject.color,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                      <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Reviews & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                المراجعات اليومية
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : flashcards.length === 0 ? (
                <div className="text-center py-6">
                  <Layers className="h-8 w-8 mx-auto text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground mt-2">
                    لا توجد بطاقات للمراجعة
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {flashcards.map((card) => (
                    <Link key={card.id} href="/flashcards">
                      <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                        <Sparkles className="h-4 w-4 text-primary shrink-0" />
                        <p className="text-sm truncate flex-1">{card.front}</p>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {card.subject}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                مستوى نشاطي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-muted-foreground">التقدم العام</span>
                    <span className="text-sm font-medium">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2.5" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-primary/5 p-3 text-center">
                    <p className="text-xl font-bold text-primary">{completedLessons}</p>
                    <p className="text-[10px] text-muted-foreground">دروس مكتملة</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/10 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalLessons}</p>
                    <p className="text-[10px] text-muted-foreground">إجمالي الدروس</p>
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 p-3 flex items-center gap-3">
                  <Flame className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      {streak > 0
                        ? `أنت في سلسلة ${streak} أيام! استمر 🎉`
                        : "ابدأ سلسلة التعلم اليوم!"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      حافظ على الاستمرارية لتحقيق إنجازات
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
