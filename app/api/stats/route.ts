import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const stats = db.getStats()
    const leaderboard = db.getLeaderboard()

    return NextResponse.json({
      stats,
      leaderboard,
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
