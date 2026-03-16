"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, Award, Crown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  id: string
  username: string
  totalWins: number
  totalSpent: number
  rank: number
  trend?: "up" | "down" | "same"
  avatar?: string
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  title?: string
  className?: string
}

export function Leaderboard({ entries, currentUserId, title = "Top Bidders", className }: LeaderboardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`
    return `$${amount.toLocaleString()}`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/20"
      case 2:
        return "bg-gradient-to-r from-gray-400/10 to-gray-400/5 border-gray-400/20"
      case 3:
        return "bg-gradient-to-r from-amber-600/10 to-amber-600/5 border-amber-600/20"
      default:
        return "bg-muted/30"
    }
  }

  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          This Month
        </Badge>
      </div>

      {/* Leaderboard List */}
      <div className="p-4 space-y-2">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.id === currentUserId
          const isTopThree = entry.rank <= 3

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                getRankBackground(entry.rank),
                isCurrentUser && "ring-2 ring-primary/30",
                !isTopThree && "border-transparent"
              )}
            >
              {/* Rank */}
              <div className="w-8 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                  isTopThree 
                    ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.username} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    entry.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium truncate",
                      isCurrentUser && "text-primary"
                    )}>
                      {isCurrentUser ? "You" : entry.username}
                    </span>
                    {entry.trend === "up" && (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.totalWins} wins
                  </p>
                </div>
              </div>

              {/* Total Spent */}
              <div className="text-right">
                <p className={cn(
                  "font-bold tabular-nums",
                  isTopThree ? "text-base" : "text-sm"
                )}>
                  {formatCurrency(entry.totalSpent)}
                </p>
                <p className="text-xs text-muted-foreground">spent</p>
              </div>
            </motion.div>
          )
        })}

        {entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">No leaderboard data yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Sample data for demonstration
export const sampleLeaderboardData: LeaderboardEntry[] = [
  { id: "1", username: "ArtCollector", totalWins: 23, totalSpent: 1250000, rank: 1, trend: "up" },
  { id: "2", username: "LuxuryBuyer", totalWins: 18, totalSpent: 890000, rank: 2, trend: "same" },
  { id: "3", username: "GalleryOwner", totalWins: 15, totalSpent: 750000, rank: 3, trend: "up" },
  { id: "4", username: "Vintage2024", totalWins: 12, totalSpent: 450000, rank: 4, trend: "down" },
  { id: "5", username: "ClassicDealer", totalWins: 10, totalSpent: 380000, rank: 5, trend: "same" },
]
