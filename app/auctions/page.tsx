"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Users, TrendingUp, Search, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Auction, AuctionStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const categories = [
  "All",
  "Watches",
  "Automobiles",
  "Fine Art",
  "Jewelry",
  "Wine",
  "Antiques",
  "Collectibles",
]

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

function getStatusBadgeClass(status: AuctionStatus): string {
  switch (status) {
    case "live":
      return "bg-green-500 text-white"
    case "upcoming":
      return "bg-blue-500 text-white"
    case "ended":
      return "bg-gray-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auctions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAuctions(data.data)
          setFilteredAuctions(data.data)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    let filtered = auctions

    if (category !== "All") {
      filtered = filtered.filter((a) => a.category === category)
    }

    if (status !== "all") {
      filtered = filtered.filter((a) => a.status === status)
    }

    if (search) {
      filtered = filtered.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredAuctions(filtered)
  }, [search, category, status, auctions])

  const liveCount = auctions.filter((a) => a.status === "live").length
  const upcomingCount = auctions.filter((a) => a.status === "upcoming").length

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-muted to-background">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-primary/10 text-primary font-sans">
            {liveCount} Live Now
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">
            Browse Auctions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
            Discover exceptional items from prestigious collections. Place your bids
            and compete for rare treasures.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 border-b border-border sticky top-20 bg-background/95 backdrop-blur-sm z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                className="pl-9 font-sans"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[180px] font-sans">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-[150px] font-sans">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live ({liveCount})</SelectItem>
                <SelectItem value="upcoming">Upcoming ({upcomingCount})</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Auctions Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans">Loading auctions...</p>
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-sans">No auctions found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAuctions.map((auction) => (
                <Link key={auction.id} href={`/auctions/${auction.id}`}>
                  <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={auction.image}
                        alt={auction.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Status Badge */}
                      <Badge
                        className={cn(
                          "absolute top-3 left-3 font-sans capitalize",
                          getStatusBadgeClass(auction.status)
                        )}
                      >
                        {auction.status === "live" && (
                          <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                        )}
                        {auction.status}
                      </Badge>

                      {/* Category */}
                      <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white font-sans"
                      >
                        {auction.category}
                      </Badge>

                      {/* Timer & Bidders */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between text-white text-sm">
                        <div className="flex items-center gap-1 glass-dark px-2 py-1 rounded-full">
                          <Clock className="h-3 w-3" />
                          <span className="font-sans">{formatTimeRemaining(auction.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-1 glass-dark px-2 py-1 rounded-full">
                          <Users className="h-3 w-3" />
                          <span className="font-sans">{auction.bidCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-serif font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {auction.title}
                      </h3>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide">
                            Current Bid
                          </p>
                          <p className="text-xl font-bold text-primary">
                            {formatCurrency(auction.currentBid)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground font-sans flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Min +{formatCurrency(auction.minimumBid * 0.05)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
