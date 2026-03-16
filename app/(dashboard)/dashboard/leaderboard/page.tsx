"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Crown, Medal, Award, TrendingUp, Calendar, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  id: string
  username: string
  totalWins: number
  totalSpent: number
  totalBids: number
  rank: number
  trend?: "up" | "down" | "same"
  avatar?: string
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "all-time">("monthly")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Simulated leaderboard data
    const mockData: LeaderboardEntry[] = [
      { id: "1", username: "ArtConnoisseur", totalWins: 47, totalSpent: 2450000, totalBids: 312, rank: 1, trend: "same" },
      { id: "2", username: "LuxuryCollector", totalWins: 38, totalSpent: 1890000, totalBids: 285, rank: 2, trend: "up" },
      { id: "3", username: "GalleryMaster", totalWins: 32, totalSpent: 1650000, totalBids: 241, rank: 3, trend: "up" },
      { id: "4", username: "VintageHunter", totalWins: 28, totalSpent: 1420000, totalBids: 198, rank: 4, trend: "down" },
      { id: "5", username: "EliteDealer", totalWins: 24, totalSpent: 1180000, totalBids: 167, rank: 5, trend: "same" },
      { id: "6", username: "PremiumBuyer", totalWins: 21, totalSpent: 980000, totalBids: 145, rank: 6, trend: "up" },
      { id: "7", username: "ClassicsFan", totalWins: 18, totalSpent: 850000, totalBids: 132, rank: 7, trend: "down" },
      { id: "8", username: "RareFinds", totalWins: 15, totalSpent: 720000, totalBids: 118, rank: 8, trend: "same" },
      { id: "9", username: "ArtEnthusiast", totalWins: 12, totalSpent: 580000, totalBids: 95, rank: 9, trend: "up" },
      { id: "10", username: "CollectorsPrime", totalWins: 10, totalSpent: 450000, totalBids: 82, rank: 10, trend: "same" },
    ]
    setLeaderboard(mockData)
  }, [timeframe])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 via-yellow-500/10 to-transparent border-yellow-500/30"
      case 2:
        return "from-gray-400/20 via-gray-400/10 to-transparent border-gray-400/30"
      case 3:
        return "from-amber-600/20 via-amber-600/10 to-transparent border-amber-600/30"
      default:
        return "from-muted/50 to-transparent border-border/50"
    }
  }

  const topThree = leaderboard.slice(0, 3)
  const restOfLeaderboard = leaderboard.slice(3)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Top bidders and collectors on Bidder
          </p>
        </div>

        {/* Timeframe Filter */}
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as typeof timeframe)}>
          <TabsList>
            <TabsTrigger value="weekly" className="gap-2">
              <Calendar className="h-4 w-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-2">
              <Calendar className="h-4 w-4" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="all-time" className="gap-2">
              <Trophy className="h-4 w-4" />
              All Time
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Second Place */}
        {topThree[1] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:order-1 md:mt-8"
          >
            <Card className={cn(
              "relative overflow-hidden bg-gradient-to-b",
              getRankGradient(2)
            )}>
              <CardContent className="p-6 text-center">
                <div className="absolute top-4 right-4">
                  {getRankIcon(2)}
                </div>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-300 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                  {topThree[1].username.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg">{topThree[1].username}</h3>
                <p className="text-2xl font-bold text-primary mt-2">
                  {formatCurrency(topThree[1].totalSpent)}
                </p>
                <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span>{topThree[1].totalWins} wins</span>
                  <span>{topThree[1].totalBids} bids</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* First Place */}
        {topThree[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:order-2"
          >
            <Card className={cn(
              "relative overflow-hidden bg-gradient-to-b border-2",
              getRankGradient(1)
            )}>
              <CardContent className="p-8 text-center">
                <div className="absolute top-4 right-4">
                  {getRankIcon(1)}
                </div>
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-yellow-500/30">
                  {topThree[0].username.charAt(0)}
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-600 mb-2">Champion</Badge>
                <h3 className="font-semibold text-xl">{topThree[0].username}</h3>
                <p className="text-3xl font-bold text-primary mt-2">
                  {formatCurrency(topThree[0].totalSpent)}
                </p>
                <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span>{topThree[0].totalWins} wins</span>
                  <span>{topThree[0].totalBids} bids</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Third Place */}
        {topThree[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:order-3 md:mt-12"
          >
            <Card className={cn(
              "relative overflow-hidden bg-gradient-to-b",
              getRankGradient(3)
            )}>
              <CardContent className="p-6 text-center">
                <div className="absolute top-4 right-4">
                  {getRankIcon(3)}
                </div>
                <div className="h-18 w-18 rounded-full bg-gradient-to-br from-amber-600 to-amber-500 mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white h-16 w-16">
                  {topThree[2].username.charAt(0)}
                </div>
                <h3 className="font-semibold">{topThree[2].username}</h3>
                <p className="text-xl font-bold text-primary mt-2">
                  {formatCurrency(topThree[2].totalSpent)}
                </p>
                <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span>{topThree[2].totalWins} wins</span>
                  <span>{topThree[2].totalBids} bids</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Full Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {restOfLeaderboard.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 text-center">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  {entry.username.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.username}</span>
                    {entry.trend === "up" && (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.totalWins} wins | {entry.totalBids} total bids
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">{formatCurrency(entry.totalSpent)}</p>
                  <p className="text-xs text-muted-foreground">total spent</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-primary">$12.4M</p>
            <p className="text-muted-foreground mt-1">Total Volume This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-primary">1,847</p>
            <p className="text-muted-foreground mt-1">Active Bidders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-primary">342</p>
            <p className="text-muted-foreground mt-1">Auctions Completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
