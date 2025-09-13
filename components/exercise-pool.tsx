import { cn } from "@/lib/utils";

interface ExercisePoolProps {
  exercises: { id: string; icon: string; name: string }[];
  currentExerciseId?: string;
}

export function ExercisePool({
  exercises,
  currentExerciseId,
}: ExercisePoolProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className={cn(
            "text-center p-2 sm:p-3 rounded-lg transition-all",
            currentExerciseId === exercise.id
              ? "bg-orange-100 border-2 border-orange-500"
              : "bg-gray-50"
          )}
        >
          <div className="text-xl sm:text-2xl mb-1">{exercise.icon}</div>
          <div className="text-xs font-medium text-gray-700">
            {exercise.name}
          </div>
        </div>
      ))}
    </div>
  );
}
