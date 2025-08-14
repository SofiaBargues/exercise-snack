"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft } from "lucide-react"
import type { Exercise } from "@/app/page"

interface DailySummaryProps {
  completedChallenges: number
  exercises: Exercise[]
  onReset: () => void
  onBack: () => void
  currentStreak: number
}

export function DailySummary({ completedChallenges, exercises, onReset, onBack, currentStreak }: DailySummaryProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  // Calculate health metrics
  const caloriesBurned = completedChallenges * 15 // Estimate 15 calories per exercise snack
  const minutesActive = completedChallenges * 2 // Estimate 2 minutes per exercise
  const healthYearsGained = (completedChallenges * 0.002).toFixed(3) // Rough estimate based on exercise benefits
  const stressReduction = Math.min(completedChallenges * 5, 100) // Max 100% stress reduction

  const getMotivationalMessage = () => {
    if (completedChallenges === 0) return "Every journey starts with a single step!"
    if (completedChallenges < 3) return "Great start! Keep building that momentum!"
    if (completedChallenges < 6) return "Fantastic progress! You're on fire!"
    if (completedChallenges < 10) return "Amazing dedication! You're crushing it!"
    return "Incredible! You're a fitness champion!"
  }

  const generateShareableContent = () => {
    return `💪 My Exercise Summary 💪

✅ Completed: ${completedChallenges} challenges
🔥 Streak: ${currentStreak} days
🔥 Calories burned: ${caloriesBurned} kcal
⏱️ Active time: ${minutesActive} minutes
💪 Health years gained: ${healthYearsGained}
😌 Stress reduction: ${stressReduction}%

${getMotivationalMessage()}

#ExerciseSnacks #HealthyHabits #FitnessJourney`
  }

  const downloadSummaryImage = async () => {
    if (!summaryRef.current) return

    try {
      // Create canvas
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size
      canvas.width = 800
      canvas.height = 1000

      // Background
      ctx.fillStyle = "#f0f9ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 56px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Exercise Summary", canvas.width / 2, 100)

      // Date
      ctx.font = "28px system-ui, -apple-system, sans-serif"
      ctx.fillStyle = "#374151"
      const today = new Date()
      const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`
      ctx.fillText(formattedDate, canvas.width / 2, 150)

      // Stats
      const stats = [
        {
          label: "Challenges",
          sublabel: "Completed",
          value: completedChallenges.toString(),
          icon: "✓",
          bgColor: "#dcfce7",
          iconBg: "#22c55e",
          textColor: "#1f2937",
        },
        {
          label: `${currentStreak} days`,
          sublabel: "Streak",
          value: "",
          icon: "🔥",
          bgColor: "#fff7ed",
          iconBg: "#f97316",
          textColor: "#f97316",
        },
        {
          label: `${caloriesBurned} kcal`,
          sublabel: "Calories Burned",
          value: "",
          icon: "🔥",
          bgColor: "#fff7ed",
          iconBg: "#f97316",
          textColor: "#f97316",
        },
        {
          label: `${minutesActive} min`,
          sublabel: "Minutes Active",
          value: "",
          icon: "⏰",
          bgColor: "#f3e8ff",
          iconBg: "#a855f7",
          textColor: "#6366f1",
        },
      ]

      const gridStartY = 220
      const boxWidth = 200
      const boxHeight = 160
      const spacing = 50

      stats.forEach((stat, index) => {
        const x = 100 + index * (boxWidth + spacing)
        const y = gridStartY

        // Draw rounded rectangle background
        ctx.fillStyle = stat.bgColor
        ctx.beginPath()
        ctx.roundRect(x, y, boxWidth, boxHeight, 20)
        ctx.fill()

        // Draw icon circle background
        const iconSize = 60
        const iconX = x + boxWidth / 2
        const iconY = y + 40

        ctx.fillStyle = stat.iconBg
        ctx.beginPath()
        ctx.arc(iconX, iconY, iconSize / 2, 0, 2 * Math.PI)
        ctx.fill()

        // Draw icon
        ctx.fillStyle = "white"
        ctx.font = "32px system-ui, -apple-system, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(stat.icon, iconX, iconY + 10)

        // Draw main value/label
        ctx.fillStyle = stat.textColor
        ctx.font = "bold 36px system-ui, -apple-system, sans-serif"
        const mainText = stat.value || stat.label
        ctx.fillText(mainText, iconX, iconY + 60)

        // Draw sublabel
        ctx.fillStyle = "#374151"
        ctx.font = "18px system-ui, -apple-system, sans-serif"
        ctx.fillText(stat.sublabel, iconX, iconY + 85)
      })

      // Health Impact
      const healthY = 500
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 42px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Health Impact", canvas.width / 2, healthY)

      const healthStats = [
        {
          label: "Health Years Gained",
          value: `+${healthYearsGained}`,
          icon: "💪",
          color: "#f97316",
        },
        {
          label: "Stress Reduction",
          value: `${stressReduction}%`,
          icon: "😊",
          color: "#f97316",
        },
        {
          label: "Focus Improvement",
          value: `${Math.min(completedChallenges * 10, 100)}%`,
          icon: "🧠",
          color: "#f97316",
        },
      ]

      const healthStartY = healthY + 80
      const healthSpacing = 250
      const healthStartX = (canvas.width - (healthStats.length - 1) * healthSpacing) / 2

      healthStats.forEach((stat, index) => {
        const x = healthStartX + index * healthSpacing

        // Icon
        ctx.font = "48px system-ui, -apple-system, sans-serif"
        ctx.fillText(stat.icon, x, healthStartY)

        // Value
        ctx.fillStyle = stat.color
        ctx.font = "bold 42px system-ui, -apple-system, sans-serif"
        ctx.fillText(stat.value, x, healthStartY + 60)

        // Label
        ctx.fillStyle = "#374151"
        ctx.font = "16px system-ui, -apple-system, sans-serif"
        ctx.fillText(stat.label, x, healthStartY + 85)
      })

      // Motivational message
      const messageY = 800
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 32px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(getMotivationalMessage(), canvas.width / 2, messageY)

      // Footer
      ctx.fillStyle = "#6b7280"
      ctx.font = "20px system-ui, -apple-system, sans-serif"
      ctx.fillText("Generated by Exercise Snacks App", canvas.width / 2, canvas.height - 50)

      // Download the image
      const link = document.createElement("a")
      link.download = `exercise-summary-${new Date().toISOString().split("T")[0]}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
      alert("Failed to generate image. Please try again.")
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: "My Exercise Summary",
      text: generateShareableContent(),
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Error sharing:", err)
        setShowShareDialog(true)
      }
    } else {
      setShowShareDialog(true)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareableContent())
      alert("Summary copied to clipboard!")
    } catch (err) {
      console.log("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Button
        onClick={onReset}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium shadow-lg"
      >
        Start New Day
      </Button>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Exercise Dice
          </Button>
        </div>

        {/* Summary content for image generation */}
        <div ref={summaryRef}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Daily Summary</h1>
            <p className="text-xl text-gray-600">Your exercise achievements today</p>
          </div>

          {/* Main Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-3xl font-bold text-green-700 mb-1">{completedChallenges}</div>
              <div className="text-sm text-green-600 font-medium">Challenges Completed</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-orange-700 mb-1">{currentStreak}</div>
              <div className="text-sm text-orange-600 font-medium">Day Streak</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-red-700 mb-1">{caloriesBurned}</div>
              <div className="text-sm text-red-600 font-medium">Calories Burned</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-4xl mb-2">⏱️</div>
              <div className="text-3xl font-bold text-blue-700 mb-1">{minutesActive}</div>
              <div className="text-sm text-blue-600 font-medium">Minutes Active</div>
            </Card>
          </div>

          {/* Health Impact */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Health Impact Analysis</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-3">💪</div>
                <div className="text-2xl font-bold text-blue-600 mb-2">+{healthYearsGained}</div>
                <div className="text-sm text-gray-700 font-medium">Estimated Health Years Gained</div>
                <div className="text-xs text-gray-500 mt-1">Based on exercise longevity studies</div>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-3">😊</div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{stressReduction}%</div>
                <div className="text-sm text-gray-700 font-medium">Stress Reduction</div>
                <div className="text-xs text-gray-500 mt-1">Exercise releases endorphins</div>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-3">🧠</div>
                <div className="text-2xl font-bold text-blue-600 mb-2">+{Math.min(completedChallenges * 10, 100)}%</div>
                <div className="text-sm text-gray-700 font-medium">Focus Improvement</div>
                <div className="text-xs text-gray-500 mt-1">Better blood flow to brain</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleShare} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
            Share Summary
          </Button>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Share Your Progress</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm whitespace-pre-line">
              {generateShareableContent()}
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1">
                Copy to Clipboard
              </Button>
              <Button onClick={() => setShowShareDialog(false)} variant="outline" className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
