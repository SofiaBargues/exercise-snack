interface TimerDisplayProps {
  canSpin: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

export function TimerDisplay({
  canSpin,
  timeLeft,
  formatTime,
}: TimerDisplayProps) {
  return (
    <div className="text-center mb-6 sm:mb-8">
      {canSpin && (
        <div className="text-4xl sm:text-6xl font-bold text-gray-900 mb-2">
          Ready!
        </div>
      )}
      <div className="text-base sm:text-lg text-gray-600">
        {canSpin ? "Ready to spin!" : "Next exercise in..."}
      </div>
      {!canSpin && (
        <div className="mt-2 text-sm text-gray-600">
          Next spin in: {formatTime(timeLeft)}
        </div>
      )}
    </div>
  );
}
