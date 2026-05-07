"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, ChevronLeft, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch("/api/subjects")
        if (res.ok) {
          const data = await res.json()
          setSubjects(data)
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          المواد الدراسية
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          اختر مادة للبدء في التعلم
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {subjects.map((subject) => (
            <motion.div key={subject.id} variants={item}>
              <Link href={`/subjects/${subject.id}`}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: subject.color + "15" }}
                    >
                      {subject.icon}
                    </div>
                    <div className="w-full">
                      <h3 className="font-semibold text-sm mb-1">{subject.name}</h3>
                      <p className="text-[10px] text-muted-foreground mb-2">
                        {subject.lessonCount} درس
                      </p>
                      <Progress
                        value={subject.progress}
                        className="h-1.5"
                        style={
                          {
                            "--progress-background": subject.color,
                          } as React.CSSProperties
                        }
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {subject.progress}% مكتمل
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
