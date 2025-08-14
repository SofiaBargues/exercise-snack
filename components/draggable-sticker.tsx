"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface DraggableStickerProps {
  id: string
  emoji: string
  x: number
  y: number
  onMove: (id: string, x: number, y: number) => void
}

export function DraggableSticker({ id, emoji, x, y, onMove }: DraggableStickerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const stickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      // Keep sticker within bounds with padding
      const boundedX = Math.max(10, Math.min(newX, window.innerWidth - 70))
      const boundedY = Math.max(10, Math.min(newY, window.innerHeight - 70))

      onMove(id, boundedX, boundedY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault() // Prevent scrolling while dragging

      const touch = e.touches[0]
      const newX = touch.clientX - dragStart.x
      const newY = touch.clientY - dragStart.y

      // Keep sticker within bounds with padding
      const boundedX = Math.max(10, Math.min(newX, window.innerWidth - 70))
      const boundedY = Math.max(10, Math.min(newY, window.innerHeight - 70))

      onMove(id, boundedX, boundedY)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, dragStart, id, onMove])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - x,
      y: e.clientY - y,
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - x,
      y: touch.clientY - y,
    })
  }

  return (
    <>
      <div
        ref={stickerRef}
        className={`absolute text-4xl cursor-move select-none transition-all duration-200 ${
          isDragging ? "scale-125 z-30 drop-shadow-lg" : "z-20 hover:scale-110"
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          touchAction: "none", // Prevent default touch behaviors
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {emoji}
      </div>
      {isDragging && <div className="fixed inset-0 bg-black/10 z-25 pointer-events-none" />}
    </>
  )
}
