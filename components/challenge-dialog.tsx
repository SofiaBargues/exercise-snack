import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentExercise: { icon: string; name: string } | null;
  repetitions: number;
  onChallengeResponse: (completed: boolean) => void;
}

export function ChallengeDialog({
  open,
  onOpenChange,
  currentExercise,
  repetitions,
  onChallengeResponse,
}: ChallengeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl">
            Challenge Time!
          </DialogTitle>
        </DialogHeader>
        {currentExercise && (
          <div className="text-center py-4 sm:py-6">
            <div className="text-5xl sm:text-6xl mb-4">
              {currentExercise.icon}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {currentExercise.name}
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              Do{" "}
              <span className="font-bold text-orange-600">{repetitions}</span>{" "}
              repetitions
            </p>
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">
                Did you complete the challenge?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={() => onChallengeResponse(false)}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8"
                >
                  No, I'll try later
                </Button>
                <Button
                  onClick={() => onChallengeResponse(true)}
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
  );
}
