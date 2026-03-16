"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Users, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Auction {
  id: string
  title: string
  image: string
  currentBid: number
  minIncrement: number
  timeLeft: string
  bidders: number
  category: string
  isHot: boolean
}

const featuredAuctions: Auction[] = [
  {
    id: "1",
    title: "Patek Philippe Nautilus 5711",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop",
    currentBid: 125000,
    minIncrement: 5000,
    timeLeft: "2h 34m",
    bidders: 24,
    category: "Watches",
    isHot: true,
  },
  {
    id: "2",
    title: "1961 Ferrari 250 GT California",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=600&fit=crop",
    currentBid: 2500000,
    minIncrement: 50000,
    timeLeft: "5h 12m",
    bidders: 8,
    category: "Automobiles",
    isHot: true,
  },
  {
    id: "3",
    title: "Monet - Water Lilies Study",
    image: "/images/auction-art.jpg",
    currentBid: 450000,
    minIncrement: 10000,
    timeLeft: "1d 6h",
    bidders: 15,
    category: "Fine Art",
    isHot: false,
  },
  {
    id: "4",
    title: "Cartier Diamond Necklace",
    image: "/images/auction-jewelry.jpg",
    currentBid: 89000,
    minIncrement: 2500,
    timeLeft: "4h 45m",
    bidders: 31,
    category: "Jewelry",
    isHot: true,
  },
  {
    id: "5",
    title: "1787 Château Lafite Rothschild",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=600&fit=crop",
    currentBid: 156000,
    minIncrement: 5000,
    timeLeft: "8h 20m",
    bidders: 12,
    category: "Wine",
    isHot: false,
  },
  {
    id: "6",
    title: "Ming Dynasty Vase",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=600&fit=crop",
    currentBid: 320000,
    minIncrement: 10000,
    timeLeft: "12h 15m",
    bidders: 19,
    category: "Antiques",
    isHot: false,
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function AuctionCard({ auction, index }: { auction: Auction; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
   
      <div
        className={cn(
          "group relative bg-card rounded-xl overflow-hidden border border-border",
          "transition-all duration-500 cursor-pointer",
          "hover:-translate-y-3",
          // Glow effect
          "before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-500",
          "before:bg-gradient-to-br before:from-[#C9A66B]/0 before:via-[#C9A66B]/0 before:to-[#C9A66B]/0",
          "hover:before:from-[#C9A66B]/20 hover:before:via-transparent hover:before:to-[#C9A66B]/10",
          "before:-z-10 before:blur-xl before:scale-110",
          // Shadow glow
          "shadow-lg shadow-transparent hover:shadow-[0_20px_50px_-15px_rgba(201,166,107,0.4)]",
          // Border glow
          "hover:border-[#C9A66B]/50"
        )}
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={auction.image}
            alt={auction.title}
            fill
            className={cn(
              "object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
          />
          {/* Overlay on hover */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent",
              "transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-60"
            )}
          />
          {/* Gold glow overlay on hover */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-[#C9A66B]/0 via-transparent to-[#C9A66B]/0",
              "transition-all duration-500",
              isHovered && "from-[#C9A66B]/10 to-[#C9A66B]/20"
            )}
          />

          {/* Category Badge */}
          <Badge
            className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground font-sans text-xs"
          >
            {auction.category}
          </Badge>

          {/* Hot Badge with glow */}
          {auction.isHot && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-sans text-xs shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse border-none">
              HOT
            </Badge>
          )}

          {/* Timer Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="font-sans text-sm font-medium">
                  {auction.timeLeft}
                </span>
              </div>
              <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full">
                <Users className="h-4 w-4" />
                <span className="font-sans text-sm font-medium">
                  {auction.bidders}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-serif text-lg font-semibold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
            {auction.title}
          </h3>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-1">
                Current Bid
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(auction.currentBid)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-sans mb-1">
                Min. Increment
              </p>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {formatCurrency(auction.minIncrement)}
              </p>
            </div>
          </div>

          {/* Bid Button (appears on hover) */}
          <div
            className={cn(
              "mt-4 transition-all duration-300 overflow-hidden",
              isHovered ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            
     </div>
        </div>
      </div>
  
  )
}

export function FeaturedAuctions() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary font-sans">
            Featured
          </Badge>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">
            Exceptional Lots
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
            Discover our carefully curated selection of rare and valuable items
            from prestigious collections worldwide.
          </p>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredAuctions.map((auction, index) => (
            <AuctionCard key={auction.id} auction={auction} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/auctions">
            <Button
              variant="outline"
              size="lg"
              className="group font-sans px-8"
            >
              View All Auctions
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
