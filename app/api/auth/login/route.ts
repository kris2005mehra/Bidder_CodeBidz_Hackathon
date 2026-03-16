import { NextRequest, NextResponse } from "next/server"
import { userDb } from "@/lib/db"
import { hashPassword, authResponse, createToken } from "@/lib/auth"
import { ApiResponse, AuthUser } from "@/lib/types"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = userDb.findByEmail(email)
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const hashedInput = hashPassword(password)
    if (user.password !== hashedInput) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const authUser = authResponse(user)
    
    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", createToken(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return NextResponse.json<ApiResponse<AuthUser>>({
      success: true,
      data: authUser,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "An error occurred during login" },
      { status: 500 }
    )
  }
}
