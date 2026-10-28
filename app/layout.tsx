import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ThemeProvider } from "@/components/theme-provider"
import { TopProgressBar } from "@/components/ui/top-progress-bar"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Mobility Roadcare",
  description: "Smart Mobility Roadcare administration platform",
  generator: "Melchizedek Tutu",
  icons: {
    icon: [
      {
        url: "/smart-mobility-roadcare-favicon.png",
        type: "image/png",
      },
    ],
    apple: "/smart-mobility-roadcare-apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopProgressBar />
          <AuthProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
