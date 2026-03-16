"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  Gavel
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Auction, User as UserType } from "@/lib/types"

interface Stats {
  totalAuctions: number
  liveAuctions: number
  totalUsers: number
  totalValue: number
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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

export default function AdminDashboard() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [stats, setStats] = useState<Stats>({
    totalAuctions: 0,
    liveAuctions: 0,
    totalUsers: 0,
    totalValue: 0,
  })

  useEffect(() => {
    // Fetch auctions
    fetch("/api/auctions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAuctions(data.data)
          const liveAuctions = data.data.filter((a: Auction) => a.status === "live")
          const totalValue = data.data.reduce((sum: number, a: Auction) => sum + a.currentBid, 0)
          setStats((prev) => ({
            ...prev,
            totalAuctions: data.data.length,
            liveAuctions: liveAuctions.length,
            totalValue,
          }))
        }
      })

    // Fetch users
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data)
          setStats((prev) => ({ ...prev, totalUsers: data.data.length }))
        }
      })
  }, [])

  const liveAuctions = auctions.filter((a) => a.status === "live")
  const recentUsers = users.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground font-sans">
            Welcome back! Here&apos;s what&apos;s happening with your auctions.
          </p>
        </div>
        <Link href="/admin/auctions/new">
          <Button className="font-sans">
            <Package className="h-4 w-4 mr-2" />
            Create Auction
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-sans">Total Auctions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAuctions}</div>
            <p className="text-xs text-muted-foreground font-sans">
              {stats.liveAuctions} currently live
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-sans">Live Auctions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.liveAuctions}</div>
            <p className="text-xs text-muted-foreground font-sans">
              Active bidding now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-sans">Total Bidders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground font-sans">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-sans">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground font-sans flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              Current bid value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Auctions & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Auctions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif">Live Auctions</CardTitle>
              <CardDescription className="font-sans">Currently active auctions</CardDescription>
            </div>
            <Link href="/admin/auctions">
              <Button variant="ghost" size="sm" className="font-sans">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveAuctions.length === 0 ? (
                <p className="text-muted-foreground text-sm font-sans text-center py-4">
                  No live auctions at the moment
                </p>
              ) : (
                liveAuctions.slice(0, 5).map((auction) => (
                  <div
                    key={auction.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${auction.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{auction.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                        <span className="font-semibold text-foreground">
                          {formatCurrency(auction.currentBid)}
                        </span>
                        <span>•</span>
                        <span>{auction.bidCount} bids</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                      <Clock className="h-3 w-3" />
                      {formatTimeRemaining(auction.endTime)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif">Recent Bidders</CardTitle>
              <CardDescription className="font-sans">Newly registered users</CardDescription>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="font-sans">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-muted-foreground text-sm font-sans text-center py-4">
                  No users yet
                </p>
              ) : (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate font-sans">
                        {user.email}
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-sans">
                      {formatCurrency(user.credits)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
