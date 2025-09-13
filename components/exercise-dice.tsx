"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DraggableSticker } from "@/components/draggable-sticker";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise, StickerPosition } from "@/app/page";
import { DiceBox } from "@/components/dice-box";
import { StatsBar } from "@/components/stats-bar";
import { TimerDisplay } from "@/components/timer-display";
import { ExercisePool } from "@/components/exercise-pool";
import { ActionButtons } from "@/components/action-buttons";
import { ChallengeDialog } from "@/components/challenge-dialog";

interface ExerciseDiceProps {
  exercises: Exercise[];
  config: { repetitions: number; intervalMinutes: number };
  stickers: StickerPosition[];
  onChallengeComplete: (completed: boolean) => void;
  onViewSummary: () => void;
  onReset: () => void;
  onStickerMove: (id: string, x: number, y: number) => void;
  onBack: () => void;
}
throw new Error();
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
  const [timeLeft, setTimeLeft] = useState(config.intervalMinutes * 60); // in seconds
  const [canSpin, setCanSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [diceRotation, setDiceRotation] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !canSpin) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanSpin(true);
      setTimeLeft(config.intervalMinutes * 60);
    }
  }, [timeLeft, canSpin, config.intervalMinutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const spinDice = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setCanSpin(false);

    // Animate dice rotation
    const rotations = 5 + Math.random() * 5; // 5-10 rotations
    setDiceRotation((prev) => prev + rotations * 360);

    // Select random exercise after animation
    setTimeout(() => {
      const randomExercise =
        exercises[Math.floor(Math.random() * exercises.length)];
      setCurrentExercise(randomExercise);
      setIsSpinning(false);
      setShowChallengeDialog(true);
    }, 2000);
  };

  const handleChallengeResponse = (completed: boolean) => {
    setShowChallengeDialog(false);
    onChallengeComplete(completed);

    if (!completed) {
      // Reset timer if not completed
      setTimeLeft(config.intervalMinutes * 60);
      setCanSpin(true);
    }
  };

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
        <div className="text-center  sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Exercise Snack
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Spin the dice when ready for your next exercise snack!
          </p>
        </div>

        {/* Stats Bar */}
        <StatsBar
          repetitions={config.repetitions}
          intervalMinutes={config.intervalMinutes}
        />

        {/* Timer */}
        <TimerDisplay
          canSpin={canSpin}
          timeLeft={timeLeft}
          formatTime={formatTime}
        />

        {/* Dice */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <DiceBox
            isSpinning={isSpinning}
            diceRotation={diceRotation}
            currentExercise={currentExercise}
          />
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
                : "bg-orange-600/50 text-white/70 cursor-not-allowed"
            )}
          >
            {isSpinning ? "Spinning..." : "Spin the Dice!"}
          </Button>
        </div>

        {/* Selected Exercises */}
        <div className="p-4 sm:p-6 mb-6 sm:mb-8 bg-white rounded shadow">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
            Your Exercise Pool
          </h3>
          <ExercisePool
            exercises={exercises}
            currentExerciseId={currentExercise?.id}
          />
        </div>

        {/* Action Buttons */}
        <ActionButtons
          stickers={stickers.map((s) => s.emoji)}
          onViewSummary={onViewSummary}
        />
      </div>

      {/* Challenge Dialog */}
      <ChallengeDialog
        open={showChallengeDialog}
        onOpenChange={setShowChallengeDialog}
        currentExercise={currentExercise}
        repetitions={config.repetitions}
        onChallengeResponse={handleChallengeResponse}
      />
    </div>
  );
}
