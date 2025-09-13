interface StatsBarProps {
  repetitions: number;
  intervalMinutes: number;
}

export function StatsBar({ repetitions, intervalMinutes }: StatsBarProps) {
  return (
    <div className="flex justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
      <div className="px-3 py-2 sm:px-4 sm:py-2 bg-white rounded shadow">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">
            {repetitions}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Reps</div>
        </div>
      </div>
      <div className="px-3 py-2 sm:px-4 sm:py-2 bg-white rounded shadow">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">
            {intervalMinutes}m
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Interval</div>
        </div>
      </div>
    </div>
  );
}
