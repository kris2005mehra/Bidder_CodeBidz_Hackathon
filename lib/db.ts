import { User, Auction, Bid, CreditTransaction, AuctionStatus } from "./types"

// In-memory database for demo purposes
// In production, this would be MongoDB

// Helper to generate IDs
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Users database
const users: Map<string, User> = new Map()

// Simple hash function matching auth.ts
const TOKEN_SECRET = process.env.JWT_SECRET || "bidder-secret-key-2024"
function simpleHash(password: string): string {
  return Buffer.from(password + TOKEN_SECRET).toString("base64")
}

// Initialize admin user
const adminUser: User = {
  id: "admin-001",
  name: "Admin User",
  email: "admin@bidder.com",
  password: simpleHash("admin123"),
  role: "admin",
  credits: 0,
  lockedCredits: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}
users.set(adminUser.id, adminUser)

// Demo bidder users
const demoUsers: User[] = [
  {
    id: "user-001",
    name: "John Collector",
    email: "john@example.com",
    password: simpleHash("password123"),
    role: "bidder",
    credits: 50000,
    lockedCredits: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user-002",
    name: "Sarah Antique",
    email: "sarah@example.com",
    password: simpleHash("password123"),
    role: "bidder",
    credits: 75000,
    lockedCredits: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user-003",
    name: "Mike Vintage",
    email: "mike@example.com",
    password: simpleHash("password123"),
    role: "bidder",
    credits: 100000,
    lockedCredits: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
demoUsers.forEach((u) => users.set(u.id, u))

// Auctions database
const auctions: Map<string, Auction> = new Map()

// Demo auctions
const now = new Date()
const demoAuctions: Auction[] = [
  {
    id: "auction-001",
    title: "Patek Philippe Nautilus 5711",
    description: "An exceptional Patek Philippe Nautilus 5711/1A-010, one of the most coveted luxury watches in the world. This timepiece features the iconic porthole design and the prestigious Patek Philippe caliber 26-330 S C movement.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop",
    category: "Watches",
    startTime: new Date(now.getTime() - 3600000),
    endTime: new Date(now.getTime() + 7200000),
    minimumBid: 100000,
    currentBid: 125000,
    highestBidderId: "user-001",
    highestBidderName: "John Collector",
    status: "live",
    bidCount: 15,
    createdBy: "admin-001",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "auction-002",
    title: "1961 Ferrari 250 GT California",
    description: "A legendary 1961 Ferrari 250 GT California Spyder, one of only 56 ever produced. This masterpiece represents the pinnacle of Italian automotive design and engineering.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=800&fit=crop",
    category: "Automobiles",
    startTime: new Date(now.getTime() - 7200000),
    endTime: new Date(now.getTime() + 18000000),
    minimumBid: 2000000,
    currentBid: 2500000,
    highestBidderId: "user-002",
    highestBidderName: "Sarah Antique",
    status: "live",
    bidCount: 8,
    createdBy: "admin-001",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "auction-003",
    title: "Monet - Water Lilies Study",
    description: "An authentic Claude Monet study for his famous Water Lilies series. This oil on canvas captures the essence of Monet's garden at Giverny.",
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&h=800&fit=crop",
    category: "Fine Art",
    startTime: new Date(now.getTime() + 86400000),
    endTime: new Date(now.getTime() + 172800000),
    minimumBid: 400000,
    currentBid: 450000,
    highestBidderId: undefined,
    highestBidderName: undefined,
    status: "upcoming",
    bidCount: 0,
    createdBy: "admin-001",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "auction-004",
    title: "Cartier Diamond Necklace",
    description: "An exquisite Cartier diamond necklace featuring 45 carats of VVS1 diamonds set in platinum. A true masterpiece of jewelry craftsmanship.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
    category: "Jewelry",
    startTime: new Date(now.getTime() - 1800000),
    endTime: new Date(now.getTime() + 14400000),
    minimumBid: 75000,
    currentBid: 89000,
    highestBidderId: "user-003",
    highestBidderName: "Mike Vintage",
    status: "live",
    bidCount: 22,
    createdBy: "admin-001",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "auction-005",
    title: "1787 Château Lafite Rothschild",
    description: "An exceptionally rare 1787 Château Lafite Rothschild, believed to have belonged to Thomas Jefferson. One of the most historic wines in existence.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=800&fit=crop",
    category: "Wine",
    startTime: new Date(now.getTime() - 10800000),
    endTime: new Date(now.getTime() + 28800000),
    minimumBid: 150000,
    currentBid: 156000,
    highestBidderId: "user-001",
    highestBidderName: "John Collector",
    status: "live",
    bidCount: 6,
    createdBy: "admin-001",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "auction-006",
    title: "Ming Dynasty Vase",
    description: "An authentic Ming Dynasty porcelain vase from the Xuande period (1426-1435). Features the iconic blue and white glaze with dragon motifs.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=800&fit=crop",
    category: "Antiques",
    startTime: new Date(now.getTime() - 5400000),
    endTime: new Date(now.getTime() + 43200000),
    minimumBid: 300000,
    currentBid: 320000,
    highestBidderId: "user-002",
    highestBidderName: "Sarah Antique",
    status: "live",
    bidCount: 11,
    createdBy: "admin-001",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
demoAuctions.forEach((a) => auctions.set(a.id, a))

// Bids database
const bids: Map<string, Bid> = new Map()

// Credit transactions database
const transactions: Map<string, CreditTransaction> = new Map()

// User operations
export const userDb = {
  findById: (id: string): User | undefined => users.get(id),
  
  findByEmail: (email: string): User | undefined => {
    for (const user of users.values()) {
      if (user.email === email) return user
    }
    return undefined
  },
  
  create: (userData: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
    const user: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.set(user.id, user)
    return user
  },
  
  update: (id: string, data: Partial<User>): User | undefined => {
    const user = users.get(id)
    if (!user) return undefined
    const updated = { ...user, ...data, updatedAt: new Date() }
    users.set(id, updated)
    return updated
  },
  
  updateCredits: (id: string, credits: number, lockedCredits?: number): User | undefined => {
    const user = users.get(id)
    if (!user) return undefined
    const updated = {
      ...user,
      credits,
      lockedCredits: lockedCredits ?? user.lockedCredits,
      updatedAt: new Date(),
    }
    users.set(id, updated)
    return updated
  },
  
  getAll: (): User[] => Array.from(users.values()),
  
  getAllBidders: (): User[] => 
    Array.from(users.values()).filter((u) => u.role === "bidder"),
}

// Auction operations
export const auctionDb = {
  findById: (id: string): Auction | undefined => auctions.get(id),
  
  create: (auctionData: Omit<Auction, "id" | "createdAt" | "updatedAt" | "bidCount" | "currentBid" | "highestBidderId" | "highestBidderName">): Auction => {
    const auction: Auction = {
      ...auctionData,
      id: generateId(),
      currentBid: auctionData.minimumBid,
      bidCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    auctions.set(auction.id, auction)
    return auction
  },
  
  update: (id: string, data: Partial<Auction>): Auction | undefined => {
    const auction = auctions.get(id)
    if (!auction) return undefined
    const updated = { ...auction, ...data, updatedAt: new Date() }
    auctions.set(id, updated)
    return updated
  },
  
  delete: (id: string): boolean => auctions.delete(id),
  
  getAll: (): Auction[] => Array.from(auctions.values()),
  
  getByStatus: (status: AuctionStatus): Auction[] =>
    Array.from(auctions.values()).filter((a) => a.status === status),
  
  getLive: (): Auction[] =>
    Array.from(auctions.values()).filter((a) => a.status === "live"),
    
  getUpcoming: (): Auction[] =>
    Array.from(auctions.values()).filter((a) => a.status === "upcoming"),
}

// Bid operations
export const bidDb = {
  findById: (id: string): Bid | undefined => bids.get(id),
  
  create: (bidData: Omit<Bid, "id" | "timestamp">): Bid => {
    const bid: Bid = {
      ...bidData,
      id: generateId(),
      timestamp: new Date(),
    }
    bids.set(bid.id, bid)
    return bid
  },
  
  getByAuction: (auctionId: string): Bid[] =>
    Array.from(bids.values())
      .filter((b) => b.auctionId === auctionId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      
  getByUser: (userId: string): Bid[] =>
    Array.from(bids.values())
      .filter((b) => b.bidderId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      
  getRecentByAuction: (auctionId: string, seconds: number = 30): Bid[] => {
    const cutoff = new Date(Date.now() - seconds * 1000)
    return Array.from(bids.values())
      .filter((b) => b.auctionId === auctionId && b.timestamp > cutoff)
  },
  
  getAll: (): Bid[] => Array.from(bids.values()),
}

// Transaction operations
export const transactionDb = {
  create: (data: Omit<CreditTransaction, "id" | "createdAt">): CreditTransaction => {
    const transaction: CreditTransaction = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
    }
    transactions.set(transaction.id, transaction)
    return transaction
  },
  
  getByUser: (userId: string): CreditTransaction[] =>
    Array.from(transactions.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      
  getAll: (): CreditTransaction[] => Array.from(transactions.values()),
}

// Helper to update auction statuses based on time
export function updateAuctionStatuses(): void {
  const now = new Date()
  for (const auction of auctions.values()) {
    if (auction.status === "upcoming" && auction.startTime <= now) {
      auction.status = "live"
      auction.updatedAt = now
    } else if (auction.status === "live" && auction.endTime <= now) {
      auction.status = "ended"
      auction.updatedAt = now
    }
  }
}
