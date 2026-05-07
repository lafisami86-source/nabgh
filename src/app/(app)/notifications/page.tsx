"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  CheckCheck,
  Star,
  Trophy,
  BookOpen,
  Flame,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Notification {
  id: string
  title: string
  description: string
  icon: string
  read: boolean
  createdAt: string
}

const iconMap: Record<string, any> = {
  "🌟": Star,
  "🏆": Trophy,
  "📚": BookOpen,
  "🔥": Flame,
  "🤖": Sparkles,
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "إنجاز جديد!",
    description: "حصلت على إنجاز البداية المشرقة 🌟",
    icon: "🌟",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "تذكير يومي",
    description: "لا تنسَ مراجعة بطاقاتك اليومية! حافظ على سلسلة التعلم 🔥",
    icon: "🔥",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    title: "درس جديد متاح",
    description: "تم إضافة درس جديد في مادة الرياضيات 📚",
    icon: "📚",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "الآن"
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `منذ ${hours} ساعة`
    const days = Math.floor(hours / 24)
    return `منذ ${days} يوم`
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            الإشعارات
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : "لا إشعارات جديدة"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" />
            قراءة الكل
          </Button>
        )}
      </motion.div>

      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Bell className="h-12 w-12 mx-auto text-muted-foreground/20" />
          <p className="text-muted-foreground mt-3">لا توجد إشعارات</p>
          <p className="text-xs text-muted-foreground mt-1">
            ستظهر إشعاراتك هنا عند وصولها
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((notification, index) => {
              const IconComponent = iconMap[notification.icon] || Bell
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`border-0 shadow-sm transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                            !notification.read
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium">{notification.title}</h3>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {timeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
