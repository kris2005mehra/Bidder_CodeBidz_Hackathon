"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Gavel, TrendingUp, Users } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Bid } from "@/lib/types"

interface LiveBidFeedProps {
  bids: Bid[]
  currentUserId?: string
  className?: string
}

export function LiveBidFeed({ bids, currentUserId, className }: LiveBidFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [bids.length])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Gavel className="h-5 w-5 text-primary" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <h3 className="font-semibold">Live Bids</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          <Users className="h-3 w-3 mr-1" />
          {bids.length} bids
        </Badge>
      </div>

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {bids.map((bid, index) => {
              const isCurrentUser = bid.bidderId === currentUserId
              const isLatest = index === 0
              const isHighBid = index === 0

              return (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    delay: index * 0.02 
                  }}
                  className={cn(
                    "relative p-3 rounded-xl transition-all duration-300",
                    isLatest && "bg-primary/10 border border-primary/20",
                    !isLatest && "bg-muted/50 hover:bg-muted",
                    isCurrentUser && "ring-2 ring-primary/30"
                  )}
                >
                  {isLatest && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/5"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 2 }}
                    />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                        isHighBid 
                          ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {bid.bidderName?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-medium",
                            isCurrentUser && "text-primary"
                          )}>
                            {isCurrentUser ? "You" : bid.bidderName}
                          </span>
                          {isHighBid && (
                            <Badge className="bg-primary/20 text-primary text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Leading
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <motion.p
                        className={cn(
                          "font-bold tabular-nums",
                          isHighBid ? "text-lg text-primary" : "text-base"
                        )}
                        initial={isLatest ? { scale: 1.2 } : {}}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {formatCurrency(bid.amount)}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {bids.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Gavel className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">No bids yet</p>
              <p className="text-xs mt-1">Be the first to bid!</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
