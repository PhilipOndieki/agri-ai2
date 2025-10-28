"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react"
import Image from "next/image"

interface DetectionResult {
  disease: string
  confidence: number
  severity: "low" | "medium" | "high"
  description: string
  treatment: string[]
  prevention: string[]
}

export default function DetectPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setResult(null)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Mock result
    const mockResult: DetectionResult = {
      disease: "Early Blight",
      confidence: 87,
      severity: "medium",
      description:
        "Early blight is a common fungal disease affecting tomato and potato plants. It appears as dark brown spots with concentric rings on older leaves.",
      treatment: [
        "Remove and destroy infected leaves",
        "Apply copper-based fungicide",
        "Improve air circulation around plants",
        "Water at the base of plants, not overhead",
      ],
      prevention: [
        "Use disease-resistant varieties",
        "Practice crop rotation",
        "Mulch around plants to prevent soil splash",
        "Maintain proper plant spacing",
      ],
    }

    setResult(mockResult)
    setIsAnalyzing(false)
  }

  const handleReset = () => {
    setSelectedImage(null)
    setResult(null)
    setIsAnalyzing(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-chart-4 bg-chart-4/10"
      case "medium":
        return "text-secondary bg-secondary/10"
      case "high":
        return "text-destructive bg-destructive/10"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Disease Detection" subtitle="Scan your crops for diseases" />

      <main className="container px-4 py-6 space-y-6">
        {!selectedImage ? (
          <>
            {/* Upload Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Plant Image</CardTitle>
                <CardDescription>Take a photo or upload an image of your plant for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full" size="lg">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload from Gallery
                </Button>

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-chart-3/5 border-chart-3/20">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Tips for Best Results</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Take photos in good lighting</li>
                      <li>Focus on affected leaves or areas</li>
                      <li>Capture close-up details clearly</li>
                      <li>Avoid blurry or dark images</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { plant: "Tomato", disease: "Early Blight", date: "2 hours ago" },
                    { plant: "Potato", disease: "Healthy", date: "1 day ago" },
                    { plant: "Pepper", disease: "Leaf Spot", date: "3 days ago" },
                  ].map((scan, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Camera className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{scan.plant}</p>
                        <p className="text-xs text-muted-foreground">{scan.disease}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{scan.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Image Preview */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image src={selectedImage || "/placeholder.svg"} alt="Selected plant" fill className="object-cover" />
                  {!isAnalyzing && !result && (
                    <button
                      onClick={handleReset}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Button */}
            {!result && !isAnalyzing && (
              <Button onClick={handleAnalyze} className="w-full bg-primary hover:bg-primary-hover text-white" size="lg">
                Analyze Image
              </Button>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="text-center space-y-1">
                      <p className="font-medium">Analyzing Image...</p>
                      <p className="text-sm text-muted-foreground">Our AI is examining your plant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {result && (
              <>
                {/* Detection Result */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{result.disease}</CardTitle>
                        <CardDescription>Confidence: {result.confidence}%</CardDescription>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}
                      >
                        {result.severity.toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                  </CardContent>
                </Card>

                {/* Treatment */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-secondary" />
                      <CardTitle className="text-lg">Treatment</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.treatment.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Prevention */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-chart-4" />
                      <CardTitle className="text-lg">Prevention Tips</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.prevention.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-chart-4 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                    Scan Another
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary-hover text-white">Save Result</Button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
