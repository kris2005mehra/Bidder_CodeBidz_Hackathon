import { NextRequest, NextResponse } from "next/server"
import { auctionDb, bidDb, userDb, transactionDb, updateAuctionStatuses } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { ApiResponse, Bid } from "@/lib/types"

// GET bids for an auction
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bids = bidDb.getByAuction(id)

    return NextResponse.json<ApiResponse<Bid[]>>({
      success: true,
      data: bids,
    })
  } catch (error) {
    console.error("Get bids error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch bids" },
      { status: 500 }
    )
  }
}

// POST place a bid
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    if (user.role !== "bidder") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Only bidders can place bids" },
        { status: 403 }
      )
    }

    updateAuctionStatuses()
    const auction = auctionDb.findById(id)

    if (!auction) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Auction not found" },
        { status: 404 }
      )
    }

    if (auction.status !== "live") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Auction is not live" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid bid amount" },
        { status: 400 }
      )
    }

    // Check minimum bid
    if (amount <= auction.currentBid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Bid must be higher than current bid of ${auction.currentBid}` },
        { status: 400 }
      )
    }

    // Get fresh user data
    const bidder = userDb.findById(user.id)
    if (!bidder) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Calculate available credits (total - already locked)
    const availableCredits = bidder.credits - bidder.lockedCredits

    if (amount > availableCredits) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Insufficient credits. Available: ${availableCredits}` },
        { status: 400 }
      )
    }

    // Release previous highest bidder's locked credits if different user
    if (auction.highestBidderId && auction.highestBidderId !== user.id) {
      const previousBidder = userDb.findById(auction.highestBidderId)
      if (previousBidder) {
        const releaseAmount = auction.currentBid
        userDb.updateCredits(
          previousBidder.id,
          previousBidder.credits,
          Math.max(0, previousBidder.lockedCredits - releaseAmount)
        )
        transactionDb.create({
          userId: previousBidder.id,
          type: "bid_release",
          amount: releaseAmount,
          description: `Bid released - Outbid on ${auction.title}`,
          auctionId: auction.id,
        })
      }
    }

    // Lock the new bid amount
    const additionalLock = auction.highestBidderId === user.id 
      ? amount - auction.currentBid // Only lock the difference if same bidder
      : amount
    
    userDb.updateCredits(
      user.id,
      bidder.credits,
      bidder.lockedCredits + additionalLock
    )

    // Create bid record
    const bid = bidDb.create({
      auctionId: auction.id,
      bidderId: user.id,
      bidderName: user.name,
      amount,
    })

    // Update auction
    auctionDb.update(auction.id, {
      currentBid: amount,
      highestBidderId: user.id,
      highestBidderName: user.name,
      bidCount: auction.bidCount + 1,
    })

    // Create transaction record
    transactionDb.create({
      userId: user.id,
      type: "bid_lock",
      amount: additionalLock,
      description: `Bid placed on ${auction.title}`,
      auctionId: auction.id,
    })

    return NextResponse.json<ApiResponse<Bid>>(
      {
        success: true,
        data: bid,
        message: "Bid placed successfully!",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Place bid error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to place bid" },
      { status: 500 }
    )
  }
}
