"use client"

import { motion } from "framer-motion"
import { Flame, Snowflake, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface BidIntensityMeterProps {
  intensity: number // 0-100
  className?: string
}

export function BidIntensityMeter({ intensity, className }: BidIntensityMeterProps) {
  const getIntensityLevel = () => {
    if (intensity < 20) return { label: "Calm", color: "text-blue-500", bg: "bg-blue-500", icon: Snowflake }
    if (intensity < 40) return { label: "Warming Up", color: "text-cyan-500", bg: "bg-cyan-500", icon: Zap }
    if (intensity < 60) return { label: "Active", color: "text-yellow-500", bg: "bg-yellow-500", icon: Zap }
    if (intensity < 80) return { label: "Hot", color: "text-orange-500", bg: "bg-orange-500", icon: Flame }
    return { label: "On Fire!", color: "text-red-500", bg: "bg-red-500", icon: Flame }
  }

  const level = getIntensityLevel()
  const Icon = level.icon

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: intensity > 60 ? [1, 1.2, 1] : 1,
              rotate: intensity > 80 ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: intensity > 60 ? Infinity : 0,
              repeatDelay: 0.5,
            }}
          >
            <Icon className={cn("h-4 w-4", level.color)} />
          </motion.div>
          <span className="text-sm font-medium">Bid Intensity</span>
        </div>
        <span className={cn("text-sm font-bold", level.color)}>{level.label}</span>
      </div>

      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Background glow for high intensity */}
        {intensity > 60 && (
          <motion.div
            className={cn("absolute inset-0 opacity-30", level.bg)}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* Intensity bar */}
        <motion.div
          className={cn("h-full rounded-full", level.bg)}
          initial={{ width: 0 }}
          animate={{ width: `${intensity}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />

        {/* Animated particles for high intensity */}
        {intensity > 70 && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={cn("absolute h-1 w-1 rounded-full", level.bg)}
                initial={{ x: `${(intensity / 100) * 100}%`, y: "50%", opacity: 0 }}
                animate={{
                  x: [`${(intensity / 100) * 100}%`, `${(intensity / 100) * 100 + 10}%`],
                  y: ["50%", `${20 + Math.random() * 60}%`],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Intensity segments */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Calm</span>
        <span>Hot</span>
      </div>
    </div>
  )
}
