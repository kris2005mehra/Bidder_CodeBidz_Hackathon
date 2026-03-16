import { NextResponse } from "next/server"
import { userDb } from "@/lib/db"
import { isAdmin } from "@/lib/auth"
import { ApiResponse, User } from "@/lib/types"

// GET all bidders (admin only)
export async function GET() {
  try {
    const admin = await isAdmin()
    if (!admin) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const bidders = userDb.getAllBidders().map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json<ApiResponse<Omit<User, "password">[]>>({
      success: true,
      data: bidders,
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
