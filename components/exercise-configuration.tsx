"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { Exercise } from "@/app/page";

interface ExerciseConfigurationProps {
  selectedExercises: Exercise[];
  onComplete: (config: {
    repetitions: number;
    intervalMinutes: number;
  }) => void;
  onBack: () => void;
}

export function ExerciseConfiguration({
  selectedExercises,
  onComplete,
  onBack,
}: ExerciseConfigurationProps) {
  const [repetitions, setRepetitions] = useState(10);
  const [intervalMinutes, setIntervalMinutes] = useState(0.5); // Updated default interval to support seconds and added 30-second option

  const handleStart = () => {
    onComplete({ repetitions, intervalMinutes });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Configure Your Exercise Routine
          </h1>
          <p className="text-lg text-gray-600">
            Set your preferences for repetitions and timing
          </p>
        </div>

        {/* Selected Exercises Preview */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Selected Exercises
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
              >
                <span className="text-2xl">{exercise.icon}</span>
                <span className="font-medium text-gray-900">
                  {exercise.name}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Configuration Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Repetitions per Exercise
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-orange-600">
                  {repetitions}
                </span>
                <span className="text-gray-600 ml-2">reps</span>
              </div>
              <Slider
                value={[repetitions]}
                onValueChange={(value) => setRepetitions(value[0])}
                max={30}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>5 reps</span>
                <span>30 reps</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Exercise Interval
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                {intervalMinutes < 1 ? (
                  <>
                    <span className="text-3xl font-bold text-orange-600">
                      {intervalMinutes * 60}
                    </span>
                    <span className="text-gray-600 ml-2">seconds</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-orange-600">
                      {intervalMinutes}
                    </span>
                    <span className="text-gray-600 ml-2">minutes</span>
                  </>
                )}
              </div>
              <Slider
                value={[intervalMinutes]}
                onValueChange={(value) => setIntervalMinutes(value[0])}
                max={120}
                min={0.5}
                step={intervalMinutes <= 5 ? 0.5 : 15}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>30 sec</span>
                <span>120 min</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="px-8 bg-transparent"
          >
            Back to Selection
          </Button>
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8"
          >
            Start Exercise Snack
          </Button>
        </div>
      </div>
    </div>
  );
}
