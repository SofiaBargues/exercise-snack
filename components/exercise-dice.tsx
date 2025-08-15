"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StickerCollection } from "@/components/sticker-reward"
import { DraggableSticker } from "@/components/draggable-sticker"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Exercise, StickerPosition } from "@/app/page"

interface ExerciseDiceProps {
  exercises: Exercise[]
  config: { repetitions: number; intervalMinutes: number }
  stickers: StickerPosition[]
  onChallengeComplete: (completed: boolean) => void
  onViewSummary: () => void
  onReset: () => void
  onStickerMove: (id: string, x: number, y: number) => void
  onBack: () => void
}

export function ExerciseDice({
  exercises,
  config,
  stickers,
  onChallengeComplete,
  onViewSummary,
  onReset,
  onStickerMove,
  onBack,
}: ExerciseDiceProps) {
  const [timeLeft, setTimeLeft] = useState(config.intervalMinutes * 60) // in seconds
  const [canSpin, setCanSpin] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [showChallengeDialog, setShowChallengeDialog] = useState(false)
  const [diceRotation, setDiceRotation] = useState(0)

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !canSpin) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setCanSpin(true)
      setTimeLeft(config.intervalMinutes * 60)
    }
  }, [timeLeft, canSpin, config.intervalMinutes])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const spinDice = () => {
    if (!canSpin || isSpinning) return

    setIsSpinning(true)
    setCanSpin(false)

    // Animate dice rotation
    const rotations = 5 + Math.random() * 5 // 5-10 rotations
    setDiceRotation((prev) => prev + rotations * 360)

    // Select random exercise after animation
    setTimeout(() => {
      const randomExercise = exercises[Math.floor(Math.random() * exercises.length)]
      setCurrentExercise(randomExercise)
      setIsSpinning(false)
      setShowChallengeDialog(true)
    }, 2000)
  }

  const handleChallengeResponse = (completed: boolean) => {
    setShowChallengeDialog(false)
    onChallengeComplete(completed)

    if (!completed) {
      // Reset timer if not completed
      setTimeLeft(config.intervalMinutes * 60)
      setCanSpin(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 shadow-lg"
      >
        Reset App
      </Button>

      {stickers.map((sticker) => (
        <DraggableSticker
          key={sticker.id}
          id={sticker.id}
          emoji={sticker.emoji}
          x={sticker.x}
          y={sticker.y}
          onMove={onStickerMove}
        />
      ))}

      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        <div className="flex items-center mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Configuration
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Exercise Snack</h1>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Spin the dice when ready for your next exercise snack!
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Card className="px-3 py-2 sm:px-4 sm:py-2">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{config.repetitions}</div>
              <div className="text-xs sm:text-sm text-gray-600">Reps</div>
            </div>
          </Card>
          <Card className="px-3 py-2 sm:px-4 sm:py-2">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">{config.intervalMinutes}m</div>
              <div className="text-xs sm:text-sm text-gray-600">Interval</div>
            </div>
          </Card>
        </div>

        {/* Timer */}
        <div className="text-center mb-6 sm:mb-8">
          {canSpin && <div className="text-4xl sm:text-6xl font-bold text-gray-900 mb-2">Ready!</div>}
          <div className="text-base sm:text-lg text-gray-600">{canSpin ? "Ready to spin!" : "Next exercise in..."}</div>
        </div>

        {/* Dice */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <div
              className={cn(
                "w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-2xl shadow-2xl border-4 border-orange-200 flex items-center justify-center transition-transform duration-2000 ease-out",
                isSpinning && "animate-bounce",
              )}
              style={{ transform: `rotate(${diceRotation}deg)` }}
            >
              {isSpinning ? (
                <div className="text-3xl sm:text-4xl animate-spin">🎲</div>
              ) : currentExercise ? (
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl mb-1">{currentExercise.icon}</div>
                  <div className="text-xs font-semibold text-gray-700">{currentExercise.name}</div>
                </div>
              ) : (
                <div className="text-3xl sm:text-4xl">🎲</div>
              )}
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="text-center mb-6 sm:mb-8">
          <Button
            onClick={spinDice}
            disabled={!canSpin || isSpinning}
            size="lg"
            className={cn(
              "px-8 sm:px-12 py-4 text-lg sm:text-xl rounded-full w-full sm:w-auto max-w-sm transition-all",
              canSpin && !isSpinning
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-orange-600/50 text-white/70 cursor-not-allowed",
            )}
          >
            {isSpinning ? "Spinning..." : "Spin the Dice!"}
          </Button>
          {!canSpin && !isSpinning && (
            <div className="mt-2 text-sm text-gray-600">Next spin in: {formatTime(timeLeft)}</div>
          )}
        </div>

        {/* Selected Exercises */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
            Your Exercise Pool
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={cn(
                  "text-center p-2 sm:p-3 rounded-lg transition-all",
                  currentExercise?.id === exercise.id ? "bg-orange-100 border-2 border-orange-500" : "bg-gray-50",
                )}
              >
                <div className="text-xl sm:text-2xl mb-1">{exercise.icon}</div>
                <div className="text-xs font-medium text-gray-700">{exercise.name}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <StickerCollection stickers={stickers.map((s) => s.emoji)} />
          <Button onClick={onViewSummary} variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            View Daily Summary
          </Button>
        </div>
      </div>

      {/* Challenge Dialog */}
      <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
        <DialogContent className="max-w-sm sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-center text-xl sm:text-2xl">Challenge Time!</DialogTitle>
          </DialogHeader>

          {currentExercise && (
            <div className="text-center py-4 sm:py-6">
              <div className="text-5xl sm:text-6xl mb-4">{currentExercise.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{currentExercise.name}</h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Do <span className="font-bold text-orange-600">{config.repetitions}</span> repetitions
              </p>

              <div className="space-y-4">
                <p className="text-gray-700 font-medium">Did you complete the challenge?</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    onClick={() => handleChallengeResponse(false)}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-6 sm:px-8"
                  >
                    No, I'll try later
                  </Button>
                  <Button
                    onClick={() => handleChallengeResponse(true)}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-6 sm:px-8"
                  >
                    Yes, I did it!
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
