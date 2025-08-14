"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface StickerReward {
  emoji: string
  name: string
  rarity: "common" | "rare" | "epic" | "legendary"
  message: string
}

const STICKER_REWARDS: StickerReward[] = [
  // Common (70% chance)
  { emoji: "⭐", name: "Star", rarity: "common", message: "You're shining bright!" },
  { emoji: "💪", name: "Muscle", rarity: "common", message: "Getting stronger every day!" },
  { emoji: "🔥", name: "Fire", rarity: "common", message: "You're on fire!" },
  { emoji: "✨", name: "Sparkle", rarity: "common", message: "Sparkling with energy!" },
  { emoji: "🎯", name: "Target", rarity: "common", message: "Right on target!" },

  // Rare (20% chance)
  { emoji: "🏆", name: "Trophy", rarity: "rare", message: "Champion mindset!" },
  { emoji: "🚀", name: "Rocket", rarity: "rare", message: "Blasting off to success!" },
  { emoji: "💎", name: "Diamond", rarity: "rare", message: "You're a gem!" },
  { emoji: "⚡", name: "Lightning", rarity: "rare", message: "Electric performance!" },

  // Epic (8% chance)
  { emoji: "🦄", name: "Unicorn", rarity: "epic", message: "Magical dedication!" },
  { emoji: "🌟", name: "Glowing Star", rarity: "epic", message: "You're absolutely stellar!" },
  { emoji: "👑", name: "Crown", rarity: "epic", message: "Royalty in motion!" },

  // Legendary (2% chance)
  { emoji: "🏅", name: "Medal", rarity: "legendary", message: "Legendary achievement unlocked!" },
  { emoji: "🎖️", name: "Military Medal", rarity: "legendary", message: "Ultimate warrior spirit!" },
]

interface StickerRewardProps {
  isOpen: boolean
  onClose: () => void
  sticker: StickerReward
}

export function StickerRewardDialog({ isOpen, onClose, sticker }: StickerRewardProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true)
      const timer = setTimeout(() => setShowAnimation(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 border-gray-300"
      case "rare":
        return "text-blue-600 border-blue-300"
      case "epic":
        return "text-purple-600 border-purple-300"
      case "legendary":
        return "text-yellow-600 border-yellow-300"
      default:
        return "text-gray-600 border-gray-300"
    }
  }

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-50"
      case "rare":
        return "bg-blue-50"
      case "epic":
        return "bg-purple-50"
      case "legendary":
        return "bg-yellow-50"
      default:
        return "bg-gray-50"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Sticker Earned!</DialogTitle>
        </DialogHeader>

        <div className="text-center py-6">
          <div className={`relative inline-block ${showAnimation ? "animate-bounce" : ""}`}>
            <div className={`text-8xl mb-4 ${showAnimation ? "animate-pulse" : ""}`}>{sticker.emoji}</div>
            {showAnimation && (
              <div className="absolute inset-0 animate-ping">
                <div className="text-8xl opacity-75">{sticker.emoji}</div>
              </div>
            )}
          </div>

          <Card className={`p-4 mb-4 border-2 ${getRarityColor(sticker.rarity)} ${getRarityBg(sticker.rarity)}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{sticker.name}</h3>
            <div className={`text-sm font-semibold uppercase tracking-wide mb-2 ${getRarityColor(sticker.rarity)}`}>
              {sticker.rarity}
            </div>
            <p className="text-gray-700 font-medium">{sticker.message}</p>
          </Card>

          <Button onClick={onClose} size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function StickerCollection({ stickers }: { stickers: string[] }) {
  const [isOpen, setIsOpen] = useState(false)

  const stickerCounts = stickers.reduce(
    (acc, sticker) => {
      acc[sticker] = (acc[sticker] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const uniqueStickers = Object.keys(stickerCounts)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="lg" className="relative">
        View Collection ({stickers.length})
        {stickers.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {stickers.length}
          </div>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Your Sticker Collection</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {uniqueStickers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600">No stickers yet! Complete challenges to start collecting.</p>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[200px] px-4">
                <div className="flex flex-wrap justify-center items-center gap-6 max-w-md">
                  {uniqueStickers.map((sticker) => (
                    <Card
                      key={sticker}
                      className="p-4 text-center hover:shadow-lg transition-shadow flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24"
                    >
                      <div className="text-3xl md:text-4xl mb-1 flex items-center justify-center">{sticker}</div>
                      <div className="text-xs md:text-sm font-semibold text-gray-700">x{stickerCounts[sticker]}</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Total stickers collected: <span className="font-bold text-orange-600">{stickers.length}</span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function getRandomSticker(): StickerReward {
  const random = Math.random()

  if (random < 0.02) {
    // 2% chance for legendary
    const legendaryStickers = STICKER_REWARDS.filter((s) => s.rarity === "legendary")
    return legendaryStickers[Math.floor(Math.random() * legendaryStickers.length)]
  } else if (random < 0.1) {
    // 8% chance for epic
    const epicStickers = STICKER_REWARDS.filter((s) => s.rarity === "epic")
    return epicStickers[Math.floor(Math.random() * epicStickers.length)]
  } else if (random < 0.3) {
    // 20% chance for rare
    const rareStickers = STICKER_REWARDS.filter((s) => s.rarity === "rare")
    return rareStickers[Math.floor(Math.random() * rareStickers.length)]
  } else {
    // 70% chance for common
    const commonStickers = STICKER_REWARDS.filter((s) => s.rarity === "common")
    return commonStickers[Math.floor(Math.random() * commonStickers.length)]
  }
}
