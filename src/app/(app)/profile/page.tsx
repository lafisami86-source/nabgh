"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  Star,
  TrendingUp,
  Flame,
  Trophy,
  Mail,
  MapPin,
  Crown,
  Edit3,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const achievements = [
  { name: "البداية المشرقة", icon: "🌟", unlocked: true },
  { name: "المتعلم النشيط", icon: "📚", unlocked: false },
  { name: "نجم الرياضيات", icon: "🔢", unlocked: false },
  { name: "عالم المستقبل", icon: "🔬", unlocked: false },
  { name: "أديب اللغة", icon: "✍️", unlocked: false },
  { name: "الساحل المتواصل", icon: "🔥", unlocked: false },
  { name: "بطل الأسئلة", icon: "🏆", unlocked: false },
  { name: "العبقري", icon: "🧠", unlocked: false },
]

export default function ProfilePage() {
  const { data: session } = useSession()
  const name = session?.user?.name || "مستخدم"
  const email = session?.user?.email || ""
  const role = session?.user?.role || "STUDENT"
  const level = session?.user?.level || 1
  const xp = session?.user?.xp || 0
  const streak = session?.user?.streak || 0
  const plan = session?.user?.plan || "FREE"
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

  const roleLabels: Record<string, string> = {
    STUDENT: "طالب",
    TEACHER: "معلم",
    PARENT: "ولي أمر",
  }

  const planLabels: Record<string, { label: string; color: string }> = {
    FREE: { label: "مجاني", color: "bg-muted text-muted-foreground" },
    PREMIUM: { label: "مميز", color: "bg-primary text-primary-foreground" },
    FAMILY: { label: "عائلي", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  }

  const planInfo = planLabels[plan] || planLabels.FREE

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-l from-primary/20 via-primary/10 to-primary/5" />
          <CardContent className="p-6 -mt-12">
            <div className="flex items-end gap-4">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{name}</h2>
                  <Badge variant="secondary" className="text-[10px]">
                    {roleLabels[role]}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {email}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                <Edit3 className="h-3.5 w-3.5" />
                تعديل
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-4">
              <Star className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold">{level}</p>
              <p className="text-[10px] text-muted-foreground">المستوى</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-4">
              <TrendingUp className="h-5 w-5 mx-auto text-violet-500 mb-1" />
              <p className="text-2xl font-bold">{xp}</p>
              <p className="text-[10px] text-muted-foreground">النقاط</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm text-center">
            <CardContent className="p-4">
              <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
              <p className="text-2xl font-bold">{streak}</p>
              <p className="text-[10px] text-muted-foreground">السلسلة</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Plan Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">خطة الاشتراك</p>
                  <p className="text-[10px] text-muted-foreground">
                    {plan === "FREE" ? "قم بالترقية للوصول لمزيد من الميزات" : "استمتع بالميزات المميزة"}
                  </p>
                </div>
              </div>
              <Badge className={planInfo.color}>{planInfo.label}</Badge>
            </div>
            {plan === "FREE" && (
              <Button className="w-full mt-3" size="sm" asChild>
                <a href="/pricing">ترقية الخطة</a>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              الإنجازات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.name}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${
                    achievement.unlocked
                      ? "bg-primary/5"
                      : "bg-muted/50 opacity-50"
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="text-[9px] text-center font-medium leading-tight">
                    {achievement.name}
                  </span>
                  {achievement.unlocked && (
                    <Shield className="h-3 w-3 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
