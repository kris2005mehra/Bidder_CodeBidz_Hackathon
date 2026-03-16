"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { AuthUser, LoginFormData, RegisterFormData, ApiResponse } from "./types"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (data: LoginFormData) => Promise<ApiResponse<AuthUser>>
  register: (data: RegisterFormData) => Promise<ApiResponse<AuthUser>>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me")
      const result: ApiResponse<AuthUser> = await response.json()
      
      if (result.success && result.data) {
        setUser(result.data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (data: LoginFormData): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      const result: ApiResponse<AuthUser> = await response.json()
      
      if (result.success && result.data) {
        setUser(result.data)
      }
      
      return result
    } catch {
      return { success: false, error: "Network error occurred" }
    }
  }

  const register = async (data: RegisterFormData): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      const result: ApiResponse<AuthUser> = await response.json()
      
      if (result.success && result.data) {
        setUser(result.data)
      }
      
      return result
    } catch {
      return { success: false, error: "Network error occurred" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
