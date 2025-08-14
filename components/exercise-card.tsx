"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Exercise } from "@/app/page"

interface ExerciseCardProps {
  exercise: Exercise
  isSelected: boolean
  onToggle: () => void
  disabled?: boolean
}

export function ExerciseCard({ exercise, isSelected, onToggle, disabled }: ExerciseCardProps) {
  return (
    <Card
      className={cn(
        "p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center",
        isSelected ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 hover:border-orange-300",
        disabled && "opacity-50 cursor-not-allowed hover:border-gray-200",
      )}
      onClick={disabled ? undefined : onToggle}
    >
      <div className="text-center">
        <div className="text-2xl sm:text-3xl mb-2">{exercise.icon}</div>
        <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{exercise.name}</h3>
        <p className="text-xs text-gray-600 leading-tight">{exercise.description}</p>

        {isSelected && (
          <div className="mt-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
