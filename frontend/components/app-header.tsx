"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  title: string
  subtitle?: string
  showNotifications?: boolean
}

export function AppHeader({ title, subtitle, showNotifications = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {showNotifications && (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-secondary rounded-full" />
          </Button>
        )}
      </div>
    </header>
  )
}
