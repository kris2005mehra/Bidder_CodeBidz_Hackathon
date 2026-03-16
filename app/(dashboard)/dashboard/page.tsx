"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Wallet, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Gavel,
  Trophy
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Auction } from "@/lib/types"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatTimeRemaining(endTime: Date): string {
  const now = new Date()
  const diff = new Date(endTime).getTime() - now.getTime()
  
  if (diff <= 0) return "Ended"
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  
  return `${hours}h ${minutes}m`
}

export default function BidderDashboard() {
  const { user, refreshUser } = useAuth()
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    refreshUser()
    
    fetch("/api/auctions?status=live")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLiveAuctions(data.data.slice(0, 4))
        }
      })
      .finally(() => setIsLoading(false))
  }, [refreshUser])

  if (!user) return null

  const availableCredits = user.credits - user.lockedCredits

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">
          Welcome back, {user.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground font-sans">
          Here&apos;s your bidding overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-sans flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Available Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(availableCredits)}</div>
            {user.lockedCredits > 0 && (
              <p className="text-xs text-muted-foreground font-sans mt-1">
                {formatCurrency(user.lockedCredits)} locked in active bids
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-sans flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Active Bids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {user.lockedCredits > 0 ? Math.ceil(user.lockedCredits / 10000) : 0}
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Items you&apos;re bidding on
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-sans flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Won Auctions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              Items won in auctions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Auctions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-serif flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Live Auctions
            </CardTitle>
            <CardDescription className="font-sans">
              Hot items available for bidding right now
            </CardDescription>
          </div>
          <Link href="/auctions">
            <Button variant="outline" className="font-sans">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-sans">Loading auctions...</p>
            </div>
          ) : liveAuctions.length === 0 ? (
            <div className="text-center py-8">
              <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-sans">No live auctions at the moment</p>
              <p className="text-sm text-muted-foreground font-sans">
                Check back soon for exciting items!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {liveAuctions.map((auction) => (
                <Link key={auction.id} href={`/auctions/${auction.id}`}>
                  <div className="group relative rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                    <div className="relative aspect-square">
                      <Image
                        src={auction.image}
                        alt={auction.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Timer Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/50 backdrop-blur-sm text-white font-sans">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeRemaining(auction.endTime)}
                        </Badge>
                      </div>

                      {/* Info */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="font-medium text-sm truncate mb-1">
                          {auction.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">
                            {formatCurrency(auction.currentBid)}
                          </span>
                          <span className="text-xs opacity-80 font-sans">
                            {auction.bidCount} bids
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/auctions">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Gavel className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Browse All Auctions</h3>
                <p className="text-sm text-muted-foreground font-sans">
                  Discover rare items and place your bids
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/my-bids">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Track Your Bids</h3>
                <p className="text-sm text-muted-foreground font-sans">
                  Monitor your active bids and history
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
