import { NextRequest, NextResponse } from "next/server"
import { userDb, transactionDb } from "@/lib/db"
import { isAdmin } from "@/lib/auth"
import { ApiResponse, User } from "@/lib/types"

// PUT update user credits (admin only)
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

    const user = userDb.findById(id)
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    if (user.role !== "bidder") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Can only modify bidder credits" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { credits, action } = body // action: "add" | "set"

    if (typeof credits !== "number" || credits < 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid credits amount" },
        { status: 400 }
      )
    }

    let newCredits: number
    let transactionAmount: number
    let transactionType: "deposit" | "withdrawal"

    if (action === "add") {
      newCredits = user.credits + credits
      transactionAmount = credits
      transactionType = "deposit"
    } else {
      newCredits = credits
      transactionAmount = Math.abs(credits - user.credits)
      transactionType = credits > user.credits ? "deposit" : "withdrawal"
    }

    const updatedUser = userDb.updateCredits(id, newCredits)

    // Record transaction
    transactionDb.create({
      userId: id,
      type: transactionType,
      amount: transactionAmount,
      description: `Admin ${action === "add" ? "added" : "set"} credits`,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser!

    return NextResponse.json<ApiResponse<Omit<User, "password">>>({
      success: true,
      data: userWithoutPassword,
      message: `Credits updated successfully`,
    })
  } catch (error) {
    console.error("Update credits error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to update credits" },
      { status: 500 }
    )
  }
}
