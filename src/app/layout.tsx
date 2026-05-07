import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "نبغ - منصة التعلم الذكي",
  description: "منصة نبغ التعليمية الذكية - تعلّم بمتعة وتفوّق بثقة. دروس تفاعلية، تمارين ذكية، ومساعد تعليمي بالذكاء الاصطناعي.",
  keywords: ["نبغ", "تعليم", "تعلم", "ذكاء اصطناعي", "دروس", "تمارين", "منصة تعليمية"],
  authors: [{ name: "نبغ" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "نبغ - منصة التعلم الذكي",
    description: "تعلّم بمتعة وتفوّق بثقة مع نبغ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نبغ - منصة التعلم الذكي",
    description: "تعلّم بمتعة وتفوّق بثقة مع نبغ",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
