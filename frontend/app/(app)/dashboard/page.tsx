"use client"

import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, MessageCircle, Cloud, TrendingUp, Leaf, Droplets, Sun, Wind } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const quickActions = [
    {
      title: "Detect Disease",
      description: "Scan your crops",
      icon: Camera,
      href: "/detect",
      color: "bg-chart-1/10 text-chart-1",
    },
    {
      title: "Ask AI",
      description: "Get farming advice",
      icon: MessageCircle,
      href: "/chat",
      color: "bg-chart-2/10 text-chart-2",
    },
    {
      title: "Weather",
      description: "Check forecast",
      icon: Cloud,
      href: "/weather",
      color: "bg-chart-3/10 text-chart-3",
    },
  ]

  const weatherData = {
    temp: "24°C",
    condition: "Partly Cloudy",
    humidity: "65%",
    wind: "12 km/h",
  }

  const recentActivity = [
    {
      title: "Tomato Leaf Scan",
      description: "Early Blight detected",
      time: "2 hours ago",
      status: "warning",
    },
    {
      title: "Weather Alert",
      description: "Rain expected tomorrow",
      time: "5 hours ago",
      status: "info",
    },
    {
      title: "AI Consultation",
      description: "Fertilizer recommendations",
      time: "1 day ago",
      status: "success",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Dashboard" subtitle={`Welcome back, ${user?.name || "Farmer"}`} />

      <main className="container px-4 py-6 space-y-6">
        {/* Weather Overview Card */}
        <Card className="bg-gradient-to-br from-chart-3/20 to-chart-3/5 border-chart-3/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Weather</p>
                <p className="text-3xl font-bold">{weatherData.temp}</p>
                <p className="text-sm text-muted-foreground">{weatherData.condition}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Droplets className="h-4 w-4 text-chart-3" />
                  <span>{weatherData.humidity}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wind className="h-4 w-4 text-chart-3" />
                  <span>{weatherData.wind}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Farm Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Farm Insights</CardTitle>
            <CardDescription>Your farming statistics this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Leaf className="h-4 w-4" />
                  <span className="text-sm">Scans</span>
                </div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-chart-4" />
                  <span>+3 from last week</span>
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">AI Chats</span>
                </div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-chart-4" />
                  <span>+2 from last week</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest farming activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "warning"
                        ? "bg-secondary"
                        : activity.status === "info"
                          ? "bg-chart-3"
                          : "bg-chart-4"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sun className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Farming Tip of the Day</p>
                <p className="text-sm text-muted-foreground">
                  Early morning is the best time to water your crops. It reduces water loss through evaporation and
                  helps prevent fungal diseases.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
