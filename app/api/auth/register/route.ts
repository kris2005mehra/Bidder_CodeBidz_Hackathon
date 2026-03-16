import { NextRequest, NextResponse } from "next/server"
import { userDb } from "@/lib/db"
import { hashPassword, authResponse, createToken } from "@/lib/auth"
import { ApiResponse, AuthUser } from "@/lib/types"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = userDb.findByEmail(email)
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email already registered" },
        { status: 409 }
      )
    }

    // Create new user
    const user = userDb.create({
      name,
      email,
      password: hashPassword(password),
      role: "bidder",
      credits: 10000, // Starting credits for new users
      lockedCredits: 0,
    })

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

    return NextResponse.json<ApiResponse<AuthUser>>(
      {
        success: true,
        data: authUser,
        message: "Registration successful. Welcome to Bidder!",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
