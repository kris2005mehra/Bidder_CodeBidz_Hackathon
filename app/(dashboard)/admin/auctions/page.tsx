"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Clock,
  Users
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Auction, AuctionStatus } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getStatusColor(status: AuctionStatus): string {
  switch (status) {
    case "live":
      return "bg-green-500/10 text-green-600 border-green-500/20"
    case "upcoming":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "ended":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    case "cancelled":
      return "bg-red-500/10 text-red-600 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-600"
  }
}

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  const fetchAuctions = async () => {
    try {
      const res = await fetch("/api/auctions")
      const data = await res.json()
      if (data.success) {
        setAuctions(data.data)
        setFilteredAuctions(data.data)
      }
    } catch {
      toast.error("Failed to fetch auctions")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuctions()
  }, [])

  useEffect(() => {
    let filtered = auctions

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.category.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredAuctions(filtered)
  }, [search, statusFilter, auctions])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this auction?")) return

    try {
      const res = await fetch(`/api/auctions/${id}`, { method: "DELETE" })
      const data = await res.json()

      if (data.success) {
        toast.success("Auction deleted")
        fetchAuctions()
      } else {
        toast.error(data.error || "Failed to delete auction")
      }
    } catch {
      toast.error("Failed to delete auction")
    }
  }

  const handleStatusChange = async (id: string, status: AuctionStatus) => {
    try {
      const res = await fetch(`/api/auctions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(`Auction status updated to ${status}`)
        fetchAuctions()
      } else {
        toast.error(data.error || "Failed to update status")
      }
    } catch {
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Auctions</h1>
          <p className="text-muted-foreground font-sans">
            Manage all your auction listings
          </p>
        </div>
        <Link href="/admin/auctions/new">
          <Button className="font-sans">
            <Plus className="h-4 w-4 mr-2" />
            Create Auction
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search auctions..."
                className="pl-9 font-sans"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] font-sans">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-sans">Loading auctions...</p>
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-sans">No auctions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={auction.image}
                      alt={auction.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium truncate">{auction.title}</h3>
                        <p className="text-sm text-muted-foreground font-sans">
                          {auction.category}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0 font-sans capitalize", getStatusColor(auction.status))}
                      >
                        {auction.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-sans">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(auction.currentBid)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {auction.bidCount} bids
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(auction.endTime)}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/auctions/${auction.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                      </DropdownMenuItem>
                      {auction.status === "upcoming" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(auction.id, "live")}>
                          Start Auction
                        </DropdownMenuItem>
                      )}
                      {auction.status === "live" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(auction.id, "ended")}>
                          End Auction
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(auction.id)}
                        className="text-destructive"
                        disabled={auction.status === "live"}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
