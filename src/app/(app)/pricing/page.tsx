"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Check, Crown, Sparkles, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "FREE",
    name: "مجاني",
    price: "0",
    period: "",
    description: "ابدأ رحلة التعلم مجاناً",
    icon: Sparkles,
    features: [
      "3 مواد دراسية",
      "10 دروس أساسية",
      "تمارين محدودة",
      "نبوغ AI (5 رسائل/يوم)",
      "إحصائيات أساسية",
    ],
    color: "bg-muted text-muted-foreground",
    buttonVariant: "outline" as const,
  },
  {
    id: "PREMIUM",
    name: "مميز",
    price: "29",
    period: "/شهر",
    description: "الخطة الأكثر شعبية",
    icon: Crown,
    features: [
      "جميع المواد الدراسية",
      "دروس غير محدودة",
      "تمارين غير محدودة",
      "نبوغ AI غير محدود",
      "بطاقات المراجعة",
      "إحصائيات متقدمة",
      "بدون إعلانات",
      "تحديات خاصة",
    ],
    color: "bg-primary text-primary-foreground",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    id: "FAMILY",
    name: "عائلي",
    price: "49",
    period: "/شهر",
    description: "للعائلة بأكملها",
    icon: Users,
    features: [
      "كل ميزات الخطة المميزة",
      "حتى 5 أعضاء في العائلة",
      "لوحة تحكم ولي الأمر",
      "تقارير تقدم مفصلة",
      "تنبيهات مخصصة",
      "دعم أولوية",
    ],
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    buttonVariant: "outline" as const,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function PricingPage() {
  const { data: session } = useSession()
  const currentPlan = session?.user?.plan || "FREE"

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold">خطط الاشتراك</h2>
        <p className="text-sm text-muted-foreground mt-1">
          اختر الخطة المناسبة لاحتياجاتك
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = currentPlan === plan.id

          return (
            <motion.div key={plan.id} variants={item}>
              <Card
                className={cn(
                  "border-0 shadow-sm relative h-full flex flex-col",
                  plan.popular && "ring-2 ring-primary shadow-md shadow-primary/10"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground shadow-sm">
                      الأكثر شعبية
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className={cn("mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl", plan.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                  <div className="mt-3">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground"> ر.س{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.buttonVariant}
                    className="w-full mt-6"
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? "الخطة الحالية" : plan.id === "FREE" ? "ابدأ مجاناً" : "اشترك الآن"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
