import { NextRequest, NextResponse } from "next/server"
import { auctionDb, updateAuctionStatuses } from "@/lib/db"
import { isAdmin } from "@/lib/auth"
import { ApiResponse, Auction } from "@/lib/types"

// GET single auction
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    updateAuctionStatuses()

    const auction = auctionDb.findById(id)

    if (!auction) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Auction not found" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<Auction>>({
      success: true,
      data: auction,
    })
  } catch (error) {
    console.error("Get auction error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch auction" },
      { status: 500 }
    )
  }
}

// PUT update auction (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const auction = auctionDb.findById(id)
    if (!auction) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Auction not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const updatedAuction = auctionDb.update(id, body)

    return NextResponse.json<ApiResponse<Auction>>({
      success: true,
      data: updatedAuction,
      message: "Auction updated successfully",
    })
  } catch (error) {
    console.error("Update auction error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update auction" },
      { status: 500 }
    )
  }
}

// DELETE auction (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const auction = auctionDb.findById(id)
    if (!auction) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Auction not found" },
        { status: 404 }
      )
    }

    if (auction.status === "live") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Cannot delete a live auction" },
        { status: 400 }
      )
    }

    auctionDb.delete(id)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Auction deleted successfully",
    })
  } catch (error) {
    console.error("Delete auction error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to delete auction" },
      { status: 500 }
    )
  }
}
