import { NextRequest, NextResponse } from "next/server"
import { auctionDb, updateAuctionStatuses } from "@/lib/db"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { ApiResponse, Auction, AuctionStatus } from "@/lib/types"

// GET all auctions or filter by status
export async function GET(request: NextRequest) {
  try {
    // Update auction statuses based on current time
    updateAuctionStatuses()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as AuctionStatus | null
    const category = searchParams.get("category")

    let auctions = status ? auctionDb.getByStatus(status) : auctionDb.getAll()

    if (category) {
      auctions = auctions.filter(
        (a) => a.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Sort by status priority: live > upcoming > ended
    auctions.sort((a, b) => {
      const statusOrder = { live: 0, upcoming: 1, ended: 2, cancelled: 3 }
      return statusOrder[a.status] - statusOrder[b.status]
    })

    return NextResponse.json<ApiResponse<Auction[]>>({
      success: true,
      data: auctions,
    })
  } catch (error) {
    console.error("Get auctions error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch auctions" },
      { status: 500 }
    )
  }
}

// POST create new auction (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const user = await getCurrentUser()
    const body = await request.json()

    const {
      title,
      description,
      image,
      category,
      startTime,
      endTime,
      minimumBid,
    } = body

    // Validation
    if (!title || !description || !startTime || !endTime || !minimumBid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (end <= start) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "End time must be after start time" },
        { status: 400 }
      )
    }

    // Determine initial status
    const now = new Date()
    let status: AuctionStatus = "upcoming"
    if (start <= now && end > now) {
      status = "live"
    } else if (end <= now) {
      status = "ended"
    }

    const auction = auctionDb.create({
      title,
      description,
      image: image || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
      category: category || "Other",
      startTime: start,
      endTime: end,
      minimumBid: Number(minimumBid),
      status,
      createdBy: user!.id,
    })

    return NextResponse.json<ApiResponse<Auction>>(
      {
        success: true,
        data: auction,
        message: "Auction created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create auction error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to create auction" },
      { status: 500 }
    )
  }
}
