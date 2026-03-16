import { NextResponse } from "next/server"
import { ApiResponse } from "@/lib/types"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("auth-token")

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "An error occurred during logout" },
      { status: 500 }
    )
  }
}
