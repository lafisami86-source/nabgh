"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  BookOpen,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  description: string
  order: number
  difficulty: string
  duration: number
  exerciseCount: number
  status: string
  score: number
}

interface SubjectDetail {
  id: string
  name: string
  icon: string
  color: string
  lessons: Lesson[]
}

const difficultyMap: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "مبتدئ", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  INTERMEDIATE: { label: "متوسط", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ADVANCED: { label: "متقدم", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

const statusMap: Record<string, { icon: any; label: string; color: string }> = {
  NOT_STARTED: { icon: Circle, label: "لم يبدأ", color: "text-muted-foreground" },
  IN_PROGRESS: { icon: Clock, label: "قيد التعلم", color: "text-amber-500" },
  COMPLETED: { icon: CheckCircle2, label: "مكتمل", color: "text-emerald-500" },
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export default function SubjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [subject, setSubject] = useState<SubjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubject() {
      try {
        const res = await fetch(`/api/subjects/${id}/lessons`)
        if (res.ok) {
          const data = await res.json()
          setSubject(data)
        }
      } catch (error) {
        console.error("Failed to fetch subject:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchSubject()
  }, [id])

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <Skeleton className="h-20 w-full mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30" />
        <p className="text-muted-foreground mt-3">المادة غير موجودة</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/subjects")}>
          العودة للمواد
        </Button>
      </div>
    )
  }

  const completedCount = subject.lessons.filter((l) => l.status === "COMPLETED").length
  const progressPercent = subject.lessons.length > 0
    ? Math.round((completedCount / subject.lessons.length) * 100)
    : 0

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 gap-1 text-muted-foreground"
          onClick={() => router.push("/subjects")}
        >
          <ChevronLeft className="h-4 w-4" />
          المواد
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
            style={{ backgroundColor: subject.color + "15" }}
          >
            {subject.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{subject.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {completedCount} من {subject.lessons.length} درس مكتمل ({progressPercent}%)
            </p>
            <div className="w-full max-w-xs h-1.5 bg-primary/10 rounded-full mt-2">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, backgroundColor: subject.color }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lessons */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {subject.lessons.map((lesson) => {
          const diff = difficultyMap[lesson.difficulty] || difficultyMap.BEGINNER
          const status = statusMap[lesson.status] || statusMap.NOT_STARTED
          const StatusIcon = status.icon

          return (
            <motion.div key={lesson.id} variants={item}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${status.color}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{lesson.title}</h3>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 border-0 ${diff.color}`}
                        >
                          {diff.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lesson.duration} دقيقة
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {lesson.exerciseCount} تمرين
                        </span>
                        {lesson.status === "COMPLETED" && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            النتيجة: {lesson.score}%
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors mt-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
