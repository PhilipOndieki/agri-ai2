import type React from "react"
import { Geist, Crimson_Text } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-crimson",
})

export const metadata = {
  title: "AgriAI - Smart Farming Assistant",
  description: "AI-powered farming assistant for crop disease detection, weather forecasting, and farming advice",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriAI",
  },
  generator: 'v0.app'
}

// Move themeColor to viewport export (fixes the warning)
export const viewport = {
  themeColor: "#2d5016",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${crimsonText.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}