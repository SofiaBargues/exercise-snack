"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Exercise } from "@/app/page"

const AVAILABLE_EXERCISES: Exercise[] = [
  { id: "pushups", name: "Push-ups", icon: "💪", description: "Upper body strength" },
  { id: "squats", name: "Squats", icon: "🦵", description: "Lower body power" },
  { id: "crunches", name: "Crunches", icon: "🔥", description: "Core strength" },
  { id: "lunges", name: "Lunges", icon: "🏃", description: "Leg stability" },
  { id: "planks", name: "Planks", icon: "⚡", description: "Full core engagement" },
  { id: "jumping-jacks", name: "Jumping Jacks", icon: "🤸", description: "Cardio burst" },
  { id: "tricep-dips", name: "Tricep Dips", icon: "💎", description: "Arm definition" },
  { id: "mountain-climbers", name: "Mountain Climbers", icon: "⛰️", description: "Full body cardio" },
  { id: "wall-sits", name: "Wall Sits", icon: "🧱", description: "Leg endurance" },
  { id: "burpees", name: "Burpees", icon: "🚀", description: "Total body blast" },
  { id: "high-knees", name: "High Knees", icon: "🦘", description: "Cardio activation" },
  { id: "back-extensions", name: "Back Extensions", icon: "🌟", description: "Lower back strength" },
]

interface ExerciseSelectorProps {
  onSelectionComplete: (exercises: Exercise[]) => void
  initialSelection?: Exercise[]
  showContinueButton?: boolean
}

export function ExerciseSelector({
  onSelectionComplete,
  initialSelection = [],
  showContinueButton = true,
}: ExerciseSelectorProps) {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(initialSelection)

  const handleExerciseAdd = (exerciseId: string) => {
    const exercise = AVAILABLE_EXERCISES.find((e) => e.id === exerciseId)
    if (!exercise) return

    setSelectedExercises((prev) => {
      const isAlreadySelected = prev.some((e) => e.id === exercise.id)
      if (isAlreadySelected) return prev

      const newSelection = [...prev, exercise]
      onSelectionComplete(newSelection)
      return newSelection
    })
  }

  const handleExerciseRemove = (exerciseId: string) => {
    setSelectedExercises((prev) => {
      const newSelection = prev.filter((e) => e.id !== exerciseId)
      onSelectionComplete(newSelection)
      return newSelection
    })
  }

  const availableExercises = AVAILABLE_EXERCISES.filter(
    (exercise) => !selectedExercises.some((selected) => selected.id === exercise.id),
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Select Exercises</label>
        <Select onValueChange={handleExerciseAdd}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose an exercise to add..." />
          </SelectTrigger>
          <SelectContent>
            {availableExercises.map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.id}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{exercise.icon}</span>
                  <div>
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-xs text-gray-500">{exercise.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedExercises.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Selected Exercises</h3>
            <span className="text-sm text-gray-500">{selectedExercises.length}</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedExercises.map((exercise) => (
              <Badge
                key={exercise.id}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 hover:bg-orange-200"
              >
                <span className="text-base">{exercise.icon}</span>
                <span className="font-medium">{exercise.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-orange-300"
                  onClick={() => handleExerciseRemove(exercise.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <p className="text-sm text-gray-600">Selected: {selectedExercises.length} exercises</p>
      </div>
    </div>
  )
}
