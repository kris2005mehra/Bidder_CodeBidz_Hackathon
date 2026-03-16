"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react"
import type { Auction, Bid, User } from "./types"

// Since we can't use actual Socket.io in this environment, we'll simulate real-time with polling + events
type SocketEvent = 
  | { type: "bid_placed"; data: { auctionId: string; bid: Bid; newCurrentBid: number } }
  | { type: "auction_started"; data: { auctionId: string } }
  | { type: "auction_ended"; data: { auctionId: string; winnerId?: string } }
  | { type: "user_joined"; data: { auctionId: string; userId: string; username: string } }
  | { type: "countdown_update"; data: { auctionId: string; timeRemaining: number } }

interface SocketContextType {
  isConnected: boolean
  activeAuction: Auction | null
  liveBids: Bid[]
  activeUsers: { id: string; username: string }[]
  bidIntensity: number
  placeBid: (auctionId: string, amount: number) => Promise<{ success: boolean; error?: string }>
  joinAuction: (auctionId: string) => void
  leaveAuction: () => void
  subscribeToEvent: (event: string, callback: (data: unknown) => void) => () => void
}

const SocketContext = createContext<SocketContextType | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [activeAuction, setActiveAuction] = useState<Auction | null>(null)
  const [liveBids, setLiveBids] = useState<Bid[]>([])
  const [activeUsers, setActiveUsers] = useState<{ id: string; username: string }[]>([])
  const [bidIntensity, setBidIntensity] = useState(0)
  const [currentAuctionId, setCurrentAuctionId] = useState<string | null>(null)
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const eventListenersRef = useRef<Map<string, Set<(data: unknown) => void>>>(new Map())
  const lastBidCountRef = useRef(0)
  const intensityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate connection
  useEffect(() => {
    const timer = setTimeout(() => setIsConnected(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Emit event to listeners
  const emitEvent = useCallback((event: string, data: unknown) => {
    const listeners = eventListenersRef.current.get(event)
    if (listeners) {
      listeners.forEach(callback => callback(data))
    }
  }, [])

  // Subscribe to events
  const subscribeToEvent = useCallback((event: string, callback: (data: unknown) => void) => {
    if (!eventListenersRef.current.has(event)) {
      eventListenersRef.current.set(event, new Set())
    }
    eventListenersRef.current.get(event)!.add(callback)
    
    return () => {
      eventListenersRef.current.get(event)?.delete(callback)
    }
  }, [])

  // Calculate bid intensity based on recent bids
  const updateBidIntensity = useCallback((bids: Bid[]) => {
    const now = Date.now()
    const recentBids = bids.filter(bid => now - new Date(bid.timestamp).getTime() < 30000)
    const intensity = Math.min(100, recentBids.length * 15)
    setBidIntensity(intensity)
    
    // Decay intensity over time
    if (intensityTimeoutRef.current) clearTimeout(intensityTimeoutRef.current)
    intensityTimeoutRef.current = setTimeout(() => {
      setBidIntensity(prev => Math.max(0, prev - 10))
    }, 5000)
  }, [])

  // Poll for auction updates
  const pollAuction = useCallback(async (auctionId: string) => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}`)
      if (response.ok) {
        const auction: Auction = await response.json()
        setActiveAuction(auction)
        
        // Check for new bids
        if (auction.bids.length > lastBidCountRef.current) {
          const newBids = auction.bids.slice(lastBidCountRef.current)
          newBids.forEach(bid => {
            emitEvent("bid_placed", { auctionId, bid, newCurrentBid: auction.currentBid })
          })
          lastBidCountRef.current = auction.bids.length
        }
        
        setLiveBids(auction.bids.slice(-50).reverse())
        updateBidIntensity(auction.bids)
        
        // Check auction status changes
        if (auction.status === "ended") {
          emitEvent("auction_ended", { auctionId, winnerId: auction.winnerId })
        }
      }
    } catch (error) {
      console.error("Failed to poll auction:", error)
    }
  }, [emitEvent, updateBidIntensity])

  // Join auction room
  const joinAuction = useCallback((auctionId: string) => {
    setCurrentAuctionId(auctionId)
    lastBidCountRef.current = 0
    
    // Initial fetch
    pollAuction(auctionId)
    
    // Start polling
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    pollingIntervalRef.current = setInterval(() => pollAuction(auctionId), 2000)
    
    // Simulate active users
    setActiveUsers([
      { id: "user1", username: "ArtCollector" },
      { id: "user2", username: "LuxuryBuyer" },
      { id: "user3", username: "GalleryOwner" },
    ])
  }, [pollAuction])

  // Leave auction room
  const leaveAuction = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setCurrentAuctionId(null)
    setActiveAuction(null)
    setLiveBids([])
    setActiveUsers([])
    setBidIntensity(0)
  }, [])

  // Place bid
  const placeBid = useCallback(async (auctionId: string, amount: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { success: false, error: data.error || "Failed to place bid" }
      }
      
      // Immediately poll for updates
      await pollAuction(auctionId)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." }
    }
  }, [pollAuction])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
      if (intensityTimeoutRef.current) clearTimeout(intensityTimeoutRef.current)
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        activeAuction,
        liveBids,
        activeUsers,
        bidIntensity,
        placeBid,
        joinAuction,
        leaveAuction,
        subscribeToEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
