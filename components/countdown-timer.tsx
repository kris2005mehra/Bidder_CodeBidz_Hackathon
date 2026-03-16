"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  endTime: Date | string
  onEnd?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export function CountdownTimer({ endTime, onEnd, className, size = "md" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
  const [hasEnded, setHasEnded] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime()
      const now = Date.now()
      const difference = end - now

      if (difference <= 0) {
        setHasEnded(true)
        onEnd?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference,
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)

    return () => clearInterval(timer)
  }, [endTime, onEnd])

  const isUrgent = timeLeft.total < 60000 && timeLeft.total > 0 // Less than 1 minute
  const isWarning = timeLeft.total < 300000 && timeLeft.total > 60000 // Less than 5 minutes

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className={cn(
        "relative font-mono font-bold tabular-nums",
        sizeClasses[size],
        isUrgent && "text-red-500",
        isWarning && !isUrgent && "text-orange-500"
      )}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {value.toString().padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  )

  if (hasEnded) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <Clock className="h-4 w-4" />
        <span className="font-medium">Auction Ended</span>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(isUrgent || isWarning) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-2 text-sm font-medium",
            isUrgent ? "text-red-500" : "text-orange-500"
          )}
        >
          <AlertTriangle className="h-4 w-4" />
          {isUrgent ? "Ending soon!" : "Less than 5 minutes left!"}
        </motion.div>
      )}

      <div className={cn(
        "flex items-center gap-3",
        isUrgent && "animate-pulse"
      )}>
        <Clock className={cn(
          "h-5 w-5",
          isUrgent ? "text-red-500" : isWarning ? "text-orange-500" : "text-muted-foreground"
        )} />
        
        <div className="flex items-center gap-2">
          {timeLeft.days > 0 && (
            <>
              <TimeUnit value={timeLeft.days} label="days" />
              <span className={cn("font-bold", sizeClasses[size], "text-muted-foreground")}>:</span>
            </>
          )}
          <TimeUnit value={timeLeft.hours} label="hrs" />
          <span className={cn("font-bold", sizeClasses[size], "text-muted-foreground")}>:</span>
          <TimeUnit value={timeLeft.minutes} label="min" />
          <span className={cn("font-bold", sizeClasses[size], "text-muted-foreground")}>:</span>
          <TimeUnit value={timeLeft.seconds} label="sec" />
        </div>
      </div>
    </div>
  )
}
