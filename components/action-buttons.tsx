import { Button } from "@/components/ui/button";
import { StickerCollection } from "@/components/sticker-reward";

interface ActionButtonsProps {
  stickers: string[];
  onViewSummary: () => void;
}

export function ActionButtons({ stickers, onViewSummary }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <StickerCollection stickers={stickers} />
      <Button
        onClick={onViewSummary}
        variant="outline"
        size="lg"
        className="w-full sm:w-auto bg-transparent"
      >
        View Daily Summary
      </Button>
    </div>
  );
}
