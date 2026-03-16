"use client"

import { useEffect, useState, useCallback, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  TrendingUp, 
  Gavel, 
  History,
  AlertCircle,
  Trophy,
  Minus,
  Plus,
  Loader2
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Auction, Bid, BidStrategy, IntensityLevel } from "@/lib/types"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"


function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

function AuctionPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user, refreshUser, isAuthenticated } = useAuth()
  const [auction, setAuction] = useState<Auction | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [bidAmount, setBidAmount] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isBidding, setIsBidding] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")
  const [showHammerAnimation, setShowHammerAnimation] = useState(false)
  const [intensity, setIntensity] = useState<IntensityLevel>("low")
  const [strategy, setStrategy] = useState<BidStrategy | null>(null)

  const fetchAuction = useCallback(async () => {
    try {
      const [auctionRes, bidsRes] = await Promise.all([
        fetch(`/api/auctions/${id}`),
        fetch(`/api/auctions/${id}/bids`),
      ])

      const auctionData = await auctionRes.json()
      const bidsData = await bidsRes.json()

      if (auctionData.success) {
        setAuction(auctionData.data)
        const minBid = Math.ceil(auctionData.data.currentBid * 1.05)
        setBidAmount(minBid.toString())
      }

      if (bidsData.success) {
        setBids(bidsData.data)
        // Calculate intensity based on recent bids
        const recentBids = bidsData.data.filter((b: Bid) => {
          const bidTime = new Date(b.timestamp).getTime()
          return Date.now() - bidTime < 60000 // Last minute
        }).length
        
        if (recentBids >= 5) setIntensity("high")
        else if (recentBids >= 2) setIntensity("medium")
        else setIntensity("low")
      }
    } catch {
      toast.error("Failed to load auction")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAuction()
    const interval = setInterval(fetchAuction, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [fetchAuction])

  // Update timer
  useEffect(() => {
    if (!auction) return

    const updateTimer = () => {
      const now = new Date()
      const end = new Date(auction.endTime)
      const diff = end.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining("Auction Ended")
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeRemaining(`${days}d ${hours % 24}h ${minutes}m`)
      } else {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [auction])

  // Calculate bid strategy
  useEffect(() => {
    if (!auction || !bidAmount) return

    const currentBid = auction.currentBid
    const proposedBid = Number(bidAmount)
    const bidDiff = proposedBid - currentBid
    const bidders = auction.bidCount

    // Simple heuristic AI
    let probability = 50
    let riskLevel: "low" | "medium" | "high" = "medium"
    let strategyText = "Place your bid at a comfortable level"

    if (bidDiff <= currentBid * 0.05) {
      probability = 30
      riskLevel = "low"
      strategyText = "Consider bidding higher for better chances"
    } else if (bidDiff <= currentBid * 0.15) {
      probability = 55
      riskLevel = "medium"
      strategyText = "Good bid. Monitor the auction closely"
    } else if (bidDiff <= currentBid * 0.25) {
      probability = 70
      riskLevel = "medium"
      strategyText = "Strong bid. You're in a good position"
    } else {
      probability = 85
      riskLevel = "high"
      strategyText = "Aggressive bid. High chance but high risk"
    }

    // Adjust based on competition
    if (intensity === "high") {
      probability = Math.max(20, probability - 20)
      strategyText = "High competition! Consider waiting or bidding higher"
    } else if (intensity === "low" && bidders < 5) {
      probability = Math.min(95, probability + 15)
      strategyText = "Low competition. Good opportunity!"
    }

    setStrategy({
      winningProbability: probability,
      suggestedBid: Math.ceil(currentBid * 1.1),
      riskLevel,
      strategy: strategyText,
    })
  }, [auction, bidAmount, intensity])

  const handleBid = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!auction || auction.status !== "live") {
      toast.error("This auction is not accepting bids")
      return
    }

    const amount = Number(bidAmount)
    if (amount <= auction.currentBid) {
      toast.error(`Bid must be higher than ${formatCurrency(auction.currentBid)}`)
      return
    }

    setIsBidding(true)
    try {
      const res = await fetch(`/api/auctions/${id}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })

      const data = await res.json()

      if (data.success) {
        // Show hammer animation
        setShowHammerAnimation(true)
        setTimeout(() => setShowHammerAnimation(false), 1000)

        toast.success("Bid placed successfully!", {
          description: `You bid ${formatCurrency(amount)}`,
        })
        
        await fetchAuction()
        await refreshUser()
        setBidAmount(Math.ceil(amount * 1.05).toString())
      } else {
        toast.error(data.error || "Failed to place bid")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsBidding(false)
    }
  }

  const incrementBid = (percent: number) => {
    if (!auction) return
    const current = Number(bidAmount) || auction.currentBid
    setBidAmount(Math.ceil(current * (1 + percent)).toString())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">Auction Not Found</h1>
          <Link href="/auctions">
            <Button className="font-sans">Browse Auctions</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isEnded = auction.status === "ended"
  const isLive = auction.status === "live"
  const isWinner = user && auction.highestBidderId === user.id

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/auctions" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-sans">
            <ArrowLeft className="h-4 w-4" />
            Back to Auctions
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-card">
                <Image
                  src={auction.image}
                  alt={auction.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Status Badge */}
                <Badge
                  className={cn(
                    "absolute top-4 left-4 font-sans capitalize text-sm",
                    isLive ? "bg-green-500 text-white" : 
                    isEnded ? "bg-gray-500 text-white" : "bg-blue-500 text-white"
                  )}
                >
                  {isLive && (
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                  )}
                  {auction.status}
                </Badge>

                {/* Hammer Animation */}
                {showHammerAnimation && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 animate-in fade-in zoom-in duration-200">
                    <div className="text-center text-white">
                      <Gavel className="h-24 w-24 mx-auto animate-hammer text-gold" />
                      <p className="text-2xl font-serif font-bold mt-4">Bid Placed!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Intensity Meter */}
              {isLive && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-sans text-muted-foreground">
                        Auction Intensity
                      </span>
                      <Badge
                        className={cn(
                          "font-sans capitalize",
                          intensity === "high" ? "bg-red-500" :
                          intensity === "medium" ? "bg-amber-500" : "bg-green-500"
                        )}
                      >
                        {intensity}
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          intensity === "high" ? "w-full bg-red-500" :
                          intensity === "medium" ? "w-2/3 bg-amber-500" : "w-1/3 bg-green-500"
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Title & Category */}
              <div>
                <Badge variant="secondary" className="mb-2 font-sans">
                  {auction.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                  {auction.title}
                </h1>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {auction.description}
                </p>
              </div>

              {/* Timer */}
              <Card className={cn(
                "border-2",
                isLive ? "border-primary bg-primary/5" : "border-border"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-sans text-muted-foreground">
                        {isEnded ? "Auction Ended" : "Time Remaining"}
                      </span>
                    </div>
                    <span className="text-2xl font-bold font-mono">
                      {timeRemaining}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Current Bid */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground font-sans">Current Bid</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans">
                      <Users className="h-4 w-4" />
                      {auction.bidCount} bids
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatCurrency(auction.currentBid)}
                  </div>
                  {auction.highestBidderName && (
                    <p className="text-sm text-muted-foreground font-sans flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      Highest bidder: {auction.highestBidderName}
                      {isWinner && <Badge className="bg-green-500 text-white ml-2">You!</Badge>}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Bid Section */}
              {isLive && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Gavel className="h-5 w-5" />
                      Place Your Bid
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Bid Input */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => incrementBid(-0.05)}
                        disabled={Number(bidAmount) <= auction.currentBid * 1.05}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="text-center text-lg font-bold font-sans"
                        min={auction.currentBid + 1}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => incrementBid(0.05)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Quick Bid Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 font-sans"
                        onClick={() => setBidAmount(Math.ceil(auction.currentBid * 1.05).toString())}
                      >
                        +5%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 font-sans"
                        onClick={() => setBidAmount(Math.ceil(auction.currentBid * 1.1).toString())}
                      >
                        +10%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 font-sans"
                        onClick={() => setBidAmount(Math.ceil(auction.currentBid * 1.2).toString())}
                      >
                        +20%
                      </Button>
                    </div>

                    {/* Bid Strategy AI */}
                    {strategy && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-sans text-muted-foreground">Winning Probability</span>
                          <span className={cn(
                            "font-bold",
                            strategy.winningProbability > 60 ? "text-green-600" :
                            strategy.winningProbability > 40 ? "text-amber-600" : "text-red-600"
                          )}>
                            {strategy.winningProbability}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-sans text-muted-foreground">Risk Level</span>
                          <Badge className={cn(
                            "capitalize font-sans",
                            strategy.riskLevel === "high" ? "bg-red-500" :
                            strategy.riskLevel === "medium" ? "bg-amber-500" : "bg-green-500"
                          )}>
                            {strategy.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-sans">
                          {strategy.strategy}
                        </p>
                      </div>
                    )}

                    {/* Place Bid Button */}
                    <Button
                      className="w-full font-sans text-lg py-6 animate-pulse-gold"
                      onClick={handleBid}
                      disabled={isBidding || !isLive}
                    >
                      {isBidding ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Placing Bid...
                        </>
                      ) : (
                        <>
                          <Gavel className="h-5 w-5 mr-2" />
                          Place Bid - {formatCurrency(Number(bidAmount))}
                        </>
                      )}
                    </Button>

                    {user && (
                      <p className="text-xs text-center text-muted-foreground font-sans">
                        Available balance: {formatCurrency(user.credits - user.lockedCredits)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Winner Display */}
              {isEnded && auction.highestBidderName && (
                <Card className="border-2 border-primary bg-primary/5">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">Auction Ended</h3>
                    <p className="text-muted-foreground font-sans mb-2">
                      Won by <span className="font-semibold">{auction.highestBidderName}</span>
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(auction.currentBid)}
                    </p>
                    {isWinner && (
                      <Badge className="mt-4 bg-green-500 text-white">
                        Congratulations! You won this auction!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Bid History */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Bid History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bids.length === 0 ? (
                    <p className="text-muted-foreground text-sm font-sans text-center py-4">
                      No bids yet. Be the first to bid!
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {bids.slice(0, 10).map((bid, index) => (
                        <div
                          key={bid.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg",
                            index === 0 ? "bg-primary/10" : "bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                              {bid.bidderName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{bid.bidderName}</p>
                              <p className="text-xs text-muted-foreground font-sans">
                                {new Date(bid.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(bid.amount)}</p>
                            {index === 0 && (
                              <Badge className="bg-green-500 text-white text-xs">Highest</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AuthProvider>
      <AuctionPageContent params={params} />
    </AuthProvider>
  )
}
