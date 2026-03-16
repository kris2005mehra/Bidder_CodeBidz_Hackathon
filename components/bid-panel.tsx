"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gavel, Plus, Minus, AlertCircle, CheckCircle, Loader2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Auction } from "@/lib/types"

interface BidPanelProps {
  auction: Auction
  userCredits?: number
  onPlaceBid: (amount: number) => Promise<{ success: boolean; error?: string }>
  isAuthenticated?: boolean
  className?: string
}

export function BidPanel({
  auction,
  userCredits = 0,
  onPlaceBid,
  isAuthenticated = false,
  className
}: BidPanelProps) {

  const [bidAmount, setBidAmount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [quickBidMultiplier, setQuickBidMultiplier] = useState<number | null>(null)

  // safer minimum bid calculation
  const minBidIncrement = auction.minBidIncrement ?? 10
  const minBid = Math.max(auction.minimumBid, auction.currentBid + minBidIncrement)

  const quickBidOptions = [1, 1.5, 2, 3]

  useEffect(() => {
    setBidAmount(minBid)
  }, [auction.currentBid, auction.minimumBid, minBidIncrement])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleIncrement = () => {
    setBidAmount(prev => prev + minBidIncrement)
    setQuickBidMultiplier(null)
  }

  const handleDecrement = () => {
    setBidAmount(prev => Math.max(minBid, prev - minBidIncrement))
    setQuickBidMultiplier(null)
  }

  const handleQuickBid = (multiplier: number) => {
    setBidAmount(Math.ceil(minBid * multiplier))
    setQuickBidMultiplier(multiplier)
  }

  const handleSubmit = async () => {

    if (!isAuthenticated) {
      setFeedback({ type: "error", message: "Please login to place a bid" })
      return
    }

    if (bidAmount < minBid) {
      setFeedback({ type: "error", message: `Minimum bid is ${formatCurrency(minBid)}` })
      return
    }

    if (bidAmount > userCredits) {
      setFeedback({ type: "error", message: "Insufficient credits" })
      return
    }

    setIsSubmitting(true)
    setFeedback(null)

    const result = await onPlaceBid(bidAmount)

    setIsSubmitting(false)

    if (result.success) {
      setFeedback({ type: "success", message: "Bid placed successfully!" })
      setTimeout(() => setFeedback(null), 3000)
    } else {
      setFeedback({ type: "error", message: result.error || "Failed to place bid" })
    }
  }

  const isAuctionEnded =
    auction.status === "ended" ||
    new Date(auction.endTime) < new Date()

  const canBid =
    isAuthenticated &&
    !isAuctionEnded &&
    bidAmount >= minBid &&
    bidAmount <= userCredits

  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden",
      className
    )}>

      {/* Current Bid Display */}
      <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border/50">

        <p className="text-sm text-muted-foreground mb-1">
          Current Bid
        </p>

        <motion.p
          key={auction.currentBid}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold tabular-nums"
        >
          {formatCurrency(auction.currentBid)}
        </motion.p>

        <p className="text-sm text-muted-foreground mt-2">
          {auction.bidCount} bids | Min increment: {formatCurrency(minBidIncrement)}
        </p>

      </div>

      {/* Bid Input */}
      <div className="p-6 space-y-4">

        {/* Quick Bids */}
        <div className="space-y-2">

          <p className="text-sm font-medium">Quick Bid</p>

          <div className="grid grid-cols-4 gap-2">
            {quickBidOptions.map(multiplier => (

              <Button
                key={multiplier}
                variant={quickBidMultiplier === multiplier ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickBid(multiplier)}
                disabled={isAuctionEnded}
                className="text-xs"
              >

                {multiplier === 1
                  ? "Min"
                  : `+${((multiplier - 1) * 100).toFixed(0)}%`
                }

              </Button>

            ))}
          </div>
        </div>

        {/* Bid Input */}
        <div className="space-y-2">

          <p className="text-sm font-medium">Your Bid</p>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={isAuctionEnded || bidAmount <= minBid}
            >
              <Minus className="h-4 w-4"/>
            </Button>

            <div className="flex-1 relative">

              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>

              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(Number(e.target.value))
                  setQuickBidMultiplier(null)
                }}
                className="text-center text-lg font-bold pl-8"
                disabled={isAuctionEnded}
              />

            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={isAuctionEnded}
            >
              <Plus className="h-4 w-4"/>
            </Button>

          </div>

        </div>

        {/* User Credits */}
        {isAuthenticated && (

          <div className="flex items-center justify-between text-sm">

            <span className="text-muted-foreground">
              Your Credits
            </span>

            <span className={cn(
              "font-medium",
              userCredits < bidAmount && "text-red-500"
            )}>
              {formatCurrency(userCredits)}
            </span>

          </div>

        )}

        {/* Feedback */}
        <AnimatePresence mode="wait">

          {feedback && (

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl text-sm",
                feedback.type === "success" && "bg-green-500/10 text-green-500",
                feedback.type === "error" && "bg-red-500/10 text-red-500"
              )}
            >

              {feedback.type === "success"
                ? <CheckCircle className="h-4 w-4"/>
                : <AlertCircle className="h-4 w-4"/>
              }

              {feedback.message}

            </motion.div>

          )}

        </AnimatePresence>

        {/* Bid Button */}
        <Button
          className="w-full h-14 text-lg font-bold gap-2"
          onClick={handleSubmit}
          disabled={!canBid || isSubmitting}
        >

          {isSubmitting ? (

            <>
              <Loader2 className="h-5 w-5 animate-spin"/>
              Placing Bid...
            </>

          ) : isAuctionEnded ? (

            <>
              <AlertCircle className="h-5 w-5"/>
              Auction Ended
            </>

          ) : !isAuthenticated ? (

            <>
              <Gavel className="h-5 w-5"/>
              Login to Bid
            </>

          ) : (

            <>
              <Zap className="h-5 w-5"/>
              Place Bid - {formatCurrency(bidAmount)}
            </>

          )}

        </Button>

      </div>

    </div>
  )
}