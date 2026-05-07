"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, BookOpen, Clock, Target, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface Stats {
  totalLessons: number
  completed: number
  inProgress: number
  notStarted: number
  totalScore: number
  totalTimeSpent: number
}

export default function StatsPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const level = session?.user?.level || 1
  const xp = session?.user?.xp || 0
  const nextLevelXp = level * 100
  const xpProgress = nextLevelXp > 0 ? Math.round((xp / nextLevelXp) * 100) : 0

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/progress")
        if (res.ok) {
          const data = await res.json()
          setStats(data.stats)
        }
      } catch {
        console.error("Failed to fetch stats")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours} ساعة ${minutes} دقيقة`
    return `${minutes} دقيقة`
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          الإحصائيات
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          تتبع تقدمك وأدائك
        </p>
      </motion.div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">المستوى {level}</span>
                  <span className="text-xs text-muted-foreground">{xp}/{nextLevelXp} XP</span>
                </div>
                <Progress value={xpProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-5 w-5 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-[10px] text-muted-foreground">دروس مكتملة</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-5 w-5 mx-auto text-amber-500 mb-2" />
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-[10px] text-muted-foreground">قيد التعلم</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <Target className="h-5 w-5 mx-auto text-emerald-500 mb-2" />
                <p className="text-2xl font-bold">
                  {stats.totalLessons > 0 ? Math.round(stats.totalScore / stats.totalLessons) : 0}%
                </p>
                <p className="text-[10px] text-muted-foreground">متوسط النتائج</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <Clock className="h-5 w-5 mx-auto text-violet-500 mb-2" />
                <p className="text-lg font-bold">{formatTime(stats.totalTimeSpent)}</p>
                <p className="text-[10px] text-muted-foreground">وقت التعلم</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground mt-2">لا توجد إحصائيات بعد</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
