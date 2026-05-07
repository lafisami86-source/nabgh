"use client"

import { motion } from "framer-motion"
import { Trophy, Star, BookOpen, Flame, Brain, Target, Award, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const achievements = [
  { name: "البداية المشرقة", description: "أكمل أول درس لك في المنصة", icon: Star, category: "progress", requirement: 1, unlocked: false },
  { name: "المتعلم النشيط", description: "أكمل 5 دروس في مختلف المواد", icon: BookOpen, category: "progress", requirement: 5, unlocked: false },
  { name: "نجم الرياضيات", description: "أكمل 10 تمارين في مادة الرياضيات", icon: Brain, category: "subject", requirement: 10, unlocked: false },
  { name: "عالم المستقبل", description: "أكمل 10 تمارين في مادة العلوم", icon: Zap, category: "subject", requirement: 10, unlocked: false },
  { name: "أديب اللغة", description: "أكمل 10 تمارين في مادة اللغة العربية", icon: BookOpen, category: "subject", requirement: 10, unlocked: false },
  { name: "الساحل المتواصل", description: "حقق سلسلة تعلم لمدة 7 أيام متتالية", icon: Flame, category: "streak", requirement: 7, unlocked: false },
  { name: "بطل الأسئلة", description: "أجب على 50 سؤالاً بشكل صحيح", icon: Target, category: "exercise", requirement: 50, unlocked: false },
  { name: "العبقري", description: "حقق مستوى 10 في المنصة", icon: Award, category: "level", requirement: 10, unlocked: false },
]

const container = {
  hidden: { opacity: 0 },
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
}

export default function AchievementsPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          الإنجازات
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          حقق إنجازات واكسب مكافآت
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {achievements.map((achievement) => {
          const Icon = achievement.icon
          return (
            <motion.div key={achievement.name} variants={item}>
              <Card className={`border-0 shadow-sm ${!achievement.unlocked ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                        achievement.unlocked
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium">{achievement.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {achievement.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        المطلوب: {achievement.requirement}
                      </p>
                    </div>
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
