"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Layers, RotateCcw, ChevronLeft, Check, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    async function fetchFlashcards() {
      try {
        const res = await fetch("/api/flashcards")
        if (res.ok) {
          const data = await res.json()
          setFlashcards(data)
        }
      } catch {
        console.error("Failed to fetch flashcards")
      } finally {
        setLoading(false)
      }
    }
    fetchFlashcards()
  }, [])

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % flashcards.length)
  }

  const handlePrev = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 bg-muted rounded" />
          <div className="h-64 w-full bg-muted rounded-xl" />
        </div>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            بطاقات المراجعة
          </h2>
        </motion.div>
        <Card className="border-0 shadow-sm mt-6">
          <CardContent className="p-12 text-center">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground mt-3">لا توجد بطاقات للمراجعة</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          بطاقات المراجعة
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          راجع معلوماتك بطريقة التكرار المتباعد
        </p>
      </motion.div>

      <div className="text-center mb-4">
        <Badge variant="secondary" className="text-xs">
          {currentIndex + 1} / {flashcards.length}
        </Badge>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className="border-0 shadow-md cursor-pointer min-h-[280px] flex items-center justify-center"
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent className="p-8 text-center w-full">
            <Badge variant="outline" className="mb-4 text-xs">
              {currentCard.subject}
            </Badge>
            <p className="text-lg font-medium leading-relaxed">
              {flipped ? currentCard.back : currentCard.front}
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              {flipped ? "اضغط للسؤال" : "اضغط لكشف الإجابة"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outline" size="icon" onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="gap-1.5"
          onClick={() => {
            setFlipped(false)
            setCurrentIndex(0)
          }}
        >
          <RotateCcw className="h-4 w-4" />
          إعادة
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </Button>
      </div>
    </div>
  )
}
