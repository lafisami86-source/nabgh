"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, BookOpen, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const popularSearches = [
  "الأعداد الصحيحة",
  "الخلية",
  "الجملة الاسمية",
  "قوانين نيوتن",
  "الروابط الكيميائية",
  "أركان الإسلام",
]

export default function SearchPage() {
  const [query, setQuery] = useState("")

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          البحث
        </h2>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن درس، مادة، أو تمرين..."
            className="pr-10 pl-10 h-11 rounded-xl"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Popular Searches */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">عمليات بحث شائعة</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <Badge
                key={term}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setQuery(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>

        {query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground mt-2">
                  ابحث عن &quot;{query}&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ميزة البحث قيد التطوير
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
