// User types
export type UserRole = "admin" | "bidder"

export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: UserRole
  credits: number
  lockedCredits: number
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser extends Omit<User, "password"> {
  token: string
}

// Auction types
export type AuctionStatus = "upcoming" | "live" | "ended" | "cancelled"

export interface Auction {
  id: string
  title: string
  description: string
  image: string
  category: string
  startTime: Date
  endTime: Date
  minimumBid: number
  currentBid: number
  highestBidderId?: string
  highestBidderName?: string
  status: AuctionStatus
  bidCount: number
  createdBy: string
  createdAt: Date
  updatedAt: Date

  minBidIncrement?: number
  bids?: {
    id: string
    amount: number
    userId: string
    createdAt: string
  }[]
}

// Bid types
export interface Bid {
  id: string
  auctionId: string
  bidderId: string
  bidderName: string
  amount: number
  timestamp: Date
}

// Credit Transaction types
export type TransactionType = "deposit" | "withdrawal" | "bid_lock" | "bid_release" | "bid_deduct" | "refund"

export interface CreditTransaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  description: string
  auctionId?: string
  createdAt: Date
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Socket event types
export interface BidEvent {
  auctionId: string
  bid: Bid
  currentBid: number
  highestBidderId: string
  highestBidderName: string
}

export interface AuctionUpdateEvent {
  auctionId: string
  status: AuctionStatus
  winner?: {
    id: string
    name: string
    finalBid: number
  }
}

export interface NotificationEvent {
  type: "outbid" | "won" | "auction_ending" | "new_bid"
  message: string
  auctionId?: string
  userId?: string
}

// Bid Strategy AI types
export interface BidStrategy {
  winningProbability: number
  suggestedBid: number
  riskLevel: "low" | "medium" | "high"
  strategy: string
}

// Auction Intensity types
export type IntensityLevel = "low" | "medium" | "high"

export interface AuctionIntensity {
  level: IntensityLevel
  bidsLastMinute: number
  competitorCount: number
}

// Analytics types
export interface AuctionAnalytics {
  totalAuctions: number
  liveAuctions: number
  totalBids: number
  totalValue: number
  topBidders: {
    id: string
    name: string
    totalBids: number
    totalSpent: number
  }[]
  recentActivity: {
    date: string
    bids: number
    value: number
  }[]
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuctionFormData {
  title: string
  description: string
  category: string
  image: string
  startTime: string
  endTime: string
  minimumBid: number
}

export interface BidFormData {
  amount: number
}
