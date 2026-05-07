"use client"

import { useSession } from "next-auth/react"
import { useAppShell } from "@/hooks/use-app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Menu,
  Bell,
  Search,
  Flame,
  Diamond,
} from "lucide-react"
import Link from "next/link"

export function Topbar() {
  const { data: session } = useSession()
  const { toggleSidebar } = useAppShell()
  const role = session?.user?.role || "STUDENT"
  const streak = session?.user?.streak || 0
  const xp = session?.user?.xp || 0
  const isStudent = role === "STUDENT"

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title */}
        <div className="flex-1">
          <h1 className="text-base font-semibold">نبغ</h1>
        </div>

        {/* Student pills */}
        {isStudent && (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-0"
            >
              <Flame className="h-3.5 w-3.5" />
              {streak}
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 px-2.5 py-1 text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0"
            >
              <Diamond className="h-3.5 w-3.5" />
              {xp}
            </Badge>
          </div>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <Link href="/search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative" asChild>
            <Link href="/notifications">
              <Bell className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
