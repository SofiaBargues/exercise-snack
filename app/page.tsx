"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExerciseSelector } from "@/components/exercise-selector"
import { DailySummary } from "@/components/daily-summary"
import { cn } from "@/lib/utils"
import { Edit3 } from "lucide-react"

export type Exercise = {
  id: string
  name: string
  icon: string
  description: string
}

export type AppState = "main" | "summary"

export type StickerPosition = {
  id: string
  emoji: string
  x: number
  y: number
}

const AVAILABLE_EXERCISES: Exercise[] = [
  { id: "pushups", name: "Push-ups", icon: "💪", description: "Upper body strength" },
  { id: "squats", name: "Squats", icon: "🏃", description: "Lower body power" },
  { id: "crunches", name: "Crunches", icon: "🔥", description: "Core strength" },
  { id: "lunges", name: "Lunges", icon: "🤸", description: "Leg stability" },
  { id: "planks", name: "Planks", icon: "⚡", description: "Full core engagement" },
  { id: "jumping-jacks", name: "Jumping Jacks", icon: "🤾", description: "Cardio burst" },
  { id: "tricep-dips", name: "Tricep Dips", icon: "💎", description: "Arm definition" },
  { id: "mountain-climbers", name: "Mountain Climbers", icon: "🏔️", description: "Full body cardio" },
  { id: "wall-sits", name: "Wall Sits", icon: "🧱", description: "Leg endurance" },
  { id: "burpees", name: "Burpees", icon: "🚀", description: "Total body blast" },
  { id: "high-knees", name: "High Knees", icon: "🐎", description: "Cardio activation" },
  { id: "back-extensions", name: "Back Extensions", icon: "☀️", description: "Lower back strength" },
]

export const getRandomExercises = (count = 4): Exercise[] => {
  const shuffled = [...AVAILABLE_EXERCISES].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("main")
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(() => getRandomExercises(4))
  const [intervalMinutes, setIntervalMinutes] = useState(0.5)
  const [hasStarted, setHasStarted] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Dice functionality
  const [timeLeft, setTimeLeft] = useState(0)
  const [canSpin, setCanSpin] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [showChallengeDialog, setShowChallengeDialog] = useState(false)

  const [completedChallenges, setCompletedChallenges] = useState(0)

  const [currentStreak, setCurrentStreak] = useState(0)
  const [hasExercisedToday, setHasExercisedToday] = useState(false)

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0]
  }

  const checkAndUpdateDayStreak = () => {
    const today = getTodayString()
    const streakData = localStorage.getItem("exerciseStreak")

    if (streakData) {
      const { streak, lastExerciseDate, exercisedToday, lastAppDate } = JSON.parse(streakData)

      // Check if this is a new day since last app visit
      if (lastAppDate && lastAppDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toISOString().split("T")[0]

        if (lastExerciseDate === lastAppDate && exercisedToday) {
          // User exercised on the last day they used the app
          const newStreak = streak + 1
          setCurrentStreak(newStreak)
          setHasExercisedToday(false)

          // Update localStorage with new day
          const updatedStreakData = {
            streak: newStreak,
            lastExerciseDate: lastExerciseDate,
            exercisedToday: false,
            lastAppDate: today,
          }
          localStorage.setItem("exerciseStreak", JSON.stringify(updatedStreakData))
        } else {
          // User didn't exercise on the last day, reset streak
          setCurrentStreak(0)
          setHasExercisedToday(false)

          const updatedStreakData = {
            streak: 0,
            lastExerciseDate: null,
            exercisedToday: false,
            lastAppDate: today,
          }
          localStorage.setItem("exerciseStreak", JSON.stringify(updatedStreakData))
        }
      } else {
        // Same day or first time setting lastAppDate
        setCurrentStreak(streak)
        setHasExercisedToday(exercisedToday)

        // Update lastAppDate if not set
        if (!lastAppDate) {
          const updatedStreakData = {
            streak,
            lastExerciseDate,
            exercisedToday,
            lastAppDate: today,
          }
          localStorage.setItem("exerciseStreak", JSON.stringify(updatedStreakData))
        }
      }
    } else {
      // First time using the app
      setCurrentStreak(0)
      setHasExercisedToday(false)

      const initialStreakData = {
        streak: 0,
        lastExerciseDate: null,
        exercisedToday: false,
        lastAppDate: today,
      }
      localStorage.setItem("exerciseStreak", JSON.stringify(initialStreakData))
    }

    // Reset countdown and allow spinning for new day
    setTimeLeft(0)
    setCanSpin(true)
  }

  const updateStreak = () => {
    const today = getTodayString()

    if (!hasExercisedToday) {
      setHasExercisedToday(true)

      const streakData = JSON.parse(localStorage.getItem("exerciseStreak") || "{}")
      const updatedStreakData = {
        ...streakData,
        lastExerciseDate: today,
        exercisedToday: true,
        lastAppDate: today,
      }

      localStorage.setItem("exerciseStreak", JSON.stringify(updatedStreakData))
    }
  }

  useEffect(() => {
    checkAndUpdateDayStreak()
  }, [])

  // Timer countdown
  useEffect(() => {
    if (hasStarted && timeLeft > 0 && !canSpin) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (hasStarted && timeLeft === 0) {
      setCanSpin(true)
      setTimeLeft(intervalMinutes * 60)
    }
  }, [timeLeft, canSpin, intervalMinutes, hasStarted])

  const handleExerciseSelection = (exercises: Exercise[]) => {
    setSelectedExercises(exercises)
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const spinDice = () => {
    if (!canSpin || isSpinning) return

    setIsSpinning(true)
    setCanSpin(false)

    // Select random exercise after animation
    setTimeout(() => {
      const randomExercise = selectedExercises[Math.floor(Math.random() * selectedExercises.length)]
      setCurrentExercise(randomExercise)
      setIsSpinning(false)
      setShowChallengeDialog(true)
    }, 2000)
  }

  const handleChallengeComplete = (completed: boolean) => {
    setShowChallengeDialog(false)

    if (completed) {
      setCompletedChallenges((prev) => prev + 1)
      updateStreak()
    }

    // Timer will start automatically due to useEffect when timeLeft > 0 and canSpin is false
  }

  const handleReset = () => {
    setAppState("main")
    setSelectedExercises(getRandomExercises(4))
    setIntervalMinutes(0.5)
    setHasStarted(false)
    setTimeLeft(0)
    setCanSpin(true)
    setCurrentExercise(null)
    setCompletedChallenges(0)
    setIsEditMode(false)
  }

  if (appState === "summary") {
    return (
      <DailySummary
        completedChallenges={completedChallenges}
        exercises={selectedExercises}
        onReset={handleReset}
        onBack={() => setAppState("main")}
        currentStreak={currentStreak}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700 shadow-lg"
        >
          <Edit3 className="w-4 h-4" />
        </Button>
        {hasStarted && (
          <Button
            onClick={() => setAppState("summary")}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-lg"
          >
            Summary
          </Button>
        )}
      </div>

      <div className="px-4 py-6 sm:py-12 relative z-10 max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Exercise Dice</h1>
              <p className="text-gray-600">Spin the dice when ready for your next exercise snack!</p>
            </div>

            {/* Stats Bar */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedChallenges}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-8">
              {canSpin ? (
                <div className="text-4xl sm:text-6xl font-bold text-green-600 mb-2">Ready!</div>
              ) : (
                <div className="text-4xl sm:text-6xl font-bold text-orange-600 mb-2">{formatTime(timeLeft)}</div>
              )}
              <div className="text-lg text-gray-600">{canSpin ? "Ready to spin!" : "Next exercise in..."}</div>
            </div>

            {/* Dice */}
            <div className="flex justify-center mb-8">
              <div
                className={cn(
                  "w-32 h-32 bg-white rounded-2xl shadow-2xl border-4 border-orange-200 flex items-center justify-center transition-transform duration-300",
                  isSpinning && "animate-bounce",
                  canSpin && "hover:scale-105 cursor-pointer",
                )}
                onClick={spinDice}
              >
                {isSpinning ? (
                  <div className="text-4xl animate-spin">🎲</div>
                ) : currentExercise && !canSpin ? (
                  <div className="text-center">
                    <div className="text-4xl mb-1">{currentExercise.icon}</div>
                    <div className="text-xs font-semibold text-gray-700">{currentExercise.name}</div>
                  </div>
                ) : (
                  <div className="text-4xl">🎲</div>
                )}
              </div>
            </div>

            {/* Spin Button */}
            <div className="text-center mb-8">
              <Button
                onClick={spinDice}
                disabled={!canSpin || isSpinning}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 text-xl rounded-full disabled:opacity-50"
              >
                {isSpinning ? "Spinning..." : canSpin ? "Spin the Dice!" : `Wait ${formatTime(timeLeft)}`}
              </Button>
            </div>

            {/* Exercise Pool */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Your Exercise Pool</h3>
              <div className="flex justify-center items-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center max-w-lg mx-auto">
                  {selectedExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={cn(
                        "text-center p-3 rounded-lg transition-all flex flex-col items-center justify-center min-h-[80px] min-w-[80px] w-20 h-20",
                        currentExercise?.id === exercise.id ? "bg-orange-100 border-2 border-orange-500" : "bg-gray-50",
                      )}
                    >
                      <div className="text-2xl mb-1 flex items-center justify-center">{exercise.icon}</div>
                      <div className="text-xs font-medium text-gray-700 text-center leading-tight">{exercise.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Edit Your Routine</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Exercise Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Exercises</h3>
              <ExerciseSelector
                onSelectionComplete={handleExerciseSelection}
                initialSelection={selectedExercises}
                showContinueButton={false}
              />
            </div>

            {/* Interval Configuration */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Interval</h3>
              <div className="text-center mb-4">
                {intervalMinutes < 1 ? (
                  <>
                    <span className="text-3xl font-bold text-orange-600">{intervalMinutes * 60}</span>
                    <span className="text-gray-600 ml-2">seconds</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-orange-600">{intervalMinutes}</span>
                    <span className="text-gray-600 ml-2">minutes</span>
                  </>
                )}
              </div>
              <Slider
                value={[intervalMinutes]}
                onValueChange={(value) => setIntervalMinutes(value[0])}
                max={120}
                min={0.5}
                step={intervalMinutes <= 5 ? 0.5 : 5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>30 sec</span>
                <span>120 min</span>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => setIsEditMode(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                Done Editing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              <p className="text-base sm:text-lg text-gray-600 mb-6">Complete this exercise challenge!</p>

              <div className="space-y-4">
                <p className="text-gray-700 font-medium">Did you complete the challenge?</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button
                    onClick={() => handleChallengeComplete(false)}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-6 sm:px-8"
                  >
                    No, I'll try later
                  </Button>
                  <Button
                    onClick={() => {
                      handleChallengeComplete(true)
                      setHasStarted(true)
                      setTimeLeft(intervalMinutes * 60)
                    }}
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
