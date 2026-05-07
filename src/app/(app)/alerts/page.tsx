"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Construction } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AlertsPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          التنبيهات
        </h2>
        <p className="text-sm text-muted-foreground mt-1">تنبيهات مهمة حول أبنائك</p>
      </motion.div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <Construction className="h-12 w-12 mx-auto text-muted-foreground/30" />
          <h3 className="font-semibold mt-4">قريباً</h3>
          <p className="text-sm text-muted-foreground mt-1">صفحة التنبيهات قيد التطوير</p>
        </CardContent>
      </Card>
    </div>
  )
}
