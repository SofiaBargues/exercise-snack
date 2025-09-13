import { cn } from "@/lib/utils";

interface DiceBoxProps {
  isSpinning: boolean;
  diceRotation: number;
  currentExercise: { icon: string; name: string } | null;
}

export function DiceBox({
  isSpinning,
  diceRotation,
  currentExercise,
}: DiceBoxProps) {
  return (
    <div className="relative">
      <div
        className={cn(
          "w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-2xl shadow-2xl border-4 border-orange-200 flex items-center justify-center transition-transform duration-2000 ease-out",
          isSpinning && "animate-bounce"
        )}
        style={{ transform: `rotate(${diceRotation}deg)` }}
      >
        {isSpinning ? (
          <div className="text-3xl sm:text-4xl animate-spin">🎲</div>
        ) : currentExercise ? (
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-1">
              {currentExercise.icon}
            </div>
            <div className="text-xs font-semibold text-gray-700">
              {currentExercise.name}
            </div>
          </div>
        ) : (
          <div className="text-3xl sm:text-4xl">🎲</div>
        )}
      </div>
    </div>
  );
}
