import { cookies } from "next/headers"
import { User, AuthUser } from "./types"
import { userDb } from "./db"

// Simple JWT-like token handling (in production, use a proper JWT library)
const TOKEN_SECRET = process.env.JWT_SECRET || "bidder-secret-key-2024"

interface TokenPayload {
  userId: string
  email: string
  role: string
  exp: number
}

// Encode a simple token (base64 for demo, use proper JWT in production)
export function createToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }
  const data = JSON.stringify(payload)
  return Buffer.from(data + "." + TOKEN_SECRET).toString("base64")
}

// Decode and verify token
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [data] = decoded.split("." + TOKEN_SECRET)
    const payload = JSON.parse(data) as TokenPayload
    
    if (payload.exp < Date.now()) {
      return null // Token expired
    }
    
    return payload
  } catch {
    return null
  }
}

// Hash password (simple hash for demo, use bcrypt in production)
export function hashPassword(password: string): string {
  // In production, use bcrypt: await bcrypt.hash(password, 10)
  return Buffer.from(password + TOKEN_SECRET).toString("base64")
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  // In production, use bcrypt: await bcrypt.compare(password, hash)
  return hashPassword(password) === hash
}

// Get current user from cookies
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  
  if (!token) return null
  
  const payload = verifyToken(token)
  if (!payload) return null
  
  const user = userDb.findById(payload.userId)
  if (!user) return null
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user
  return { ...userWithoutPassword, token }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "admin"
}

// Auth response helper
export function authResponse(user: User): AuthUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user
  return { ...userWithoutPassword, token: createToken(user) }
}
