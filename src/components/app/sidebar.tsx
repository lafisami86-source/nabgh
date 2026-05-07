"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAppShell } from "@/hooks/use-app-shell"
import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  Layers,
  Zap,
  Bot,
  Trophy,
  Bell,
  BarChart3,
  Search,
  CreditCard,
  User,
  Settings,
  Users,
  CheckSquare,
  TrendingUp,
  Clock,
  FileText,
  MessageSquare,
  AlertTriangle,
  X,
  Sparkles,
} from "lucide-react"

const studentNav = [
  { label: "الرئيسية", href: "/", icon: LayoutDashboard },
  { label: "المواد", href: "/subjects", icon: BookOpen },
  { label: "التمارين", href: "/exercises", icon: PenTool },
  { label: "بطاقات", href: "/flashcards", icon: Layers },
  { label: "تحديات", href: "/challenges", icon: Zap },
  { label: "نبوغ AI", href: "/chat", icon: Bot },
  { divider: true },
  { label: "إنجازات", href: "/achievements", icon: Trophy },
  { label: "إشعارات", href: "/notifications", icon: Bell },
  { label: "الإحصائيات", href: "/stats", icon: BarChart3 },
  { label: "البحث", href: "/search", icon: Search },
  { divider: true },
  { label: "الاشتراكات", href: "/pricing", icon: CreditCard },
  { label: "ملفي الشخصي", href: "/profile", icon: User },
  { label: "الإعدادات", href: "/settings", icon: Settings },
]

const teacherNav = [
  { label: "نظرة عامة", href: "/", icon: LayoutDashboard },
  { label: "دروسي", href: "/subjects", icon: BookOpen },
  { label: "التمارين", href: "/exercises", icon: PenTool },
  { label: "طلابي", href: "/students", icon: Users },
  { label: "التصحيح", href: "/grading", icon: CheckSquare },
  { label: "تحليلات", href: "/stats", icon: BarChart3 },
]

const parentNav = [
  { label: "نظرة عامة", href: "/", icon: LayoutDashboard },
  { label: "تقدم الأبناء", href: "/progress", icon: TrendingUp },
  { label: "وقت الاستخدام", href: "/usage", icon: Clock },
  { label: "تقارير", href: "/reports", icon: FileText },
  { label: "رسائل", href: "/messages", icon: MessageSquare },
  { label: "تنبيهات", href: "/alerts", icon: AlertTriangle },
]

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: { label: string; href: string; icon: any }
  isActive: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      <span>{item.label}</span>
    </Link>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const role = session?.user?.role || "STUDENT"
  const navItems = role === "TEACHER" ? teacherNav : role === "PARENT" ? parentNav : studentNav
  const name = session?.user?.name || "مستخدم"
  const level = session?.user?.level || 1
  const xp = session?.user?.xp || 0
  const streak = session?.user?.streak || 0
  const plan = session?.user?.plan || "FREE"
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">نبغ</h2>
          <p className="text-[10px] text-muted-foreground">منصة التعلم الذكي</p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-auto h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            if ("divider" in item && item.divider) {
              return <Separator key={`div-${index}`} className="my-2" />
            }
            const navItem = item as { label: string; href: string; icon: any }
            const isActive =
              navItem.href === "/"
                ? pathname === "/"
                : pathname.startsWith(navItem.href)
            return (
              <NavItem
                key={navItem.href}
                item={navItem}
                isActive={isActive}
                onClick={onClose}
              />
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User Info */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-muted-foreground">
                المستوى {level}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {xp} XP
              </span>
            </div>
          </div>
          <Badge
            variant={plan === "PREMIUM" ? "default" : "secondary"}
            className="text-[10px] px-1.5 py-0"
          >
            {plan === "FREE" ? "مجاني" : plan === "PREMIUM" ? "مميز" : "عائلي"}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const isMobile = useIsMobile()

  if (isMobile) return null

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-l bg-sidebar text-sidebar-foreground">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppShell()

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="right" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>القائمة</SheetTitle>
        </SheetHeader>
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
