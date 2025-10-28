"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  AlertTriangle,
} from "lucide-react"

export default function WeatherPage() {
  const [activeTab, setActiveTab] = useState("today")

  // Mock weather data
  const currentWeather = {
    temp: 24,
    condition: "Partly Cloudy",
    feelsLike: 26,
    humidity: 65,
    windSpeed: 12,
    windDirection: "NE",
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    sunrise: "06:24 AM",
    sunset: "07:45 PM",
  }

  const hourlyForecast = [
    { time: "Now", temp: 24, condition: "cloudy", rain: 10 },
    { time: "2 PM", temp: 26, condition: "sunny", rain: 5 },
    { time: "4 PM", temp: 27, condition: "sunny", rain: 0 },
    { time: "6 PM", temp: 25, condition: "cloudy", rain: 15 },
    { time: "8 PM", temp: 22, condition: "rain", rain: 60 },
    { time: "10 PM", temp: 20, condition: "rain", rain: 70 },
  ]

  const weeklyForecast = [
    { day: "Today", high: 27, low: 20, condition: "cloudy", rain: 30 },
    { day: "Tomorrow", high: 25, low: 18, condition: "rain", rain: 80 },
    { day: "Wednesday", high: 23, low: 17, condition: "rain", rain: 70 },
    { day: "Thursday", high: 26, low: 19, condition: "cloudy", rain: 40 },
    { day: "Friday", high: 28, low: 21, condition: "sunny", rain: 10 },
    { day: "Saturday", high: 29, low: 22, condition: "sunny", rain: 5 },
    { day: "Sunday", high: 27, low: 20, condition: "cloudy", rain: 20 },
  ]

  const farmingAdvice = [
    {
      title: "Irrigation Recommendation",
      description: "Rain expected tomorrow. Consider reducing irrigation today.",
      icon: Droplets,
      type: "info",
    },
    {
      title: "Pest Alert",
      description: "High humidity may increase fungal disease risk. Monitor crops closely.",
      icon: AlertTriangle,
      type: "warning",
    },
    {
      title: "Optimal Planting",
      description: "Good conditions for planting this weekend. Soil moisture will be ideal.",
      icon: Sun,
      type: "success",
    },
  ]

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-amber-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-muted-foreground" />
      case "rain":
        return <CloudRain className="h-8 w-8 text-chart-3" />
      case "drizzle":
        return <CloudDrizzle className="h-8 w-8 text-chart-3" />
      case "snow":
        return <CloudSnow className="h-8 w-8 text-chart-3" />
      case "storm":
        return <CloudLightning className="h-8 w-8 text-secondary" />
      default:
        return <Cloud className="h-8 w-8 text-muted-foreground" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-secondary/10 border-secondary/20"
      case "success":
        return "bg-chart-4/10 border-chart-4/20"
      default:
        return "bg-chart-3/10 border-chart-3/20"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Weather" subtitle="Forecast and farming insights" />

      <main className="container px-4 py-6 space-y-6">
        {/* Current Weather */}
        <Card className="bg-gradient-to-br from-chart-3/20 to-chart-3/5 border-chart-3/20">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Weather</p>
                <p className="text-5xl font-bold">{currentWeather.temp}°C</p>
                <p className="text-muted-foreground">{currentWeather.condition}</p>
                <p className="text-sm text-muted-foreground">Feels like {currentWeather.feelsLike}°C</p>
              </div>
              <div className="w-20 h-20 rounded-full bg-background/50 backdrop-blur flex items-center justify-center">
                {getWeatherIcon("cloudy")}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  <span className="text-xs">Humidity</span>
                </div>
                <p className="text-lg font-semibold">{currentWeather.humidity}%</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Wind className="h-4 w-4" />
                  <span className="text-xs">Wind</span>
                </div>
                <p className="text-lg font-semibold">{currentWeather.windSpeed} km/h</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs">Pressure</span>
                </div>
                <p className="text-lg font-semibold">{currentWeather.pressure} mb</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Sunrise className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Sunrise</p>
                  <p className="text-lg font-semibold">{currentWeather.sunrise}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Sunset className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Sunset</p>
                  <p className="text-lg font-semibold">{currentWeather.sunset}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-chart-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Visibility</p>
                  <p className="text-lg font-semibold">{currentWeather.visibility} km</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Sun className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">UV Index</p>
                  <p className="text-lg font-semibold">{currentWeather.uvIndex}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forecast Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="today">Hourly</TabsTrigger>
                <TabsTrigger value="week">7 Days</TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="mt-4">
                <div className="space-y-3">
                  {hourlyForecast.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium w-16">{hour.time}</p>
                      <div className="flex items-center gap-2">{getWeatherIcon(hour.condition)}</div>
                      <p className="text-sm font-semibold w-12 text-right">{hour.temp}°C</p>
                      <div className="flex items-center gap-1 w-16 justify-end">
                        <Droplets className="h-3 w-3 text-chart-3" />
                        <span className="text-xs text-muted-foreground">{hour.rain}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="week" className="mt-4">
                <div className="space-y-3">
                  {weeklyForecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium w-24">{day.day}</p>
                      <div className="flex items-center gap-2">{getWeatherIcon(day.condition)}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{day.high}°</span>
                        <span className="text-sm text-muted-foreground">{day.low}°</span>
                      </div>
                      <div className="flex items-center gap-1 w-16 justify-end">
                        <Droplets className="h-3 w-3 text-chart-3" />
                        <span className="text-xs text-muted-foreground">{day.rain}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Farming Advice */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Farming Insights</CardTitle>
            <CardDescription>Weather-based recommendations for your farm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {farmingAdvice.map((advice, index) => {
              const Icon = advice.icon
              return (
                <div key={index} className={`p-4 rounded-lg border ${getAlertColor(advice.type)}`}>
                  <div className="flex gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{advice.title}</p>
                      <p className="text-sm text-muted-foreground">{advice.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
