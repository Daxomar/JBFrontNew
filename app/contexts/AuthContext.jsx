"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

const AuthContext = createContext(null)

// Protected route paths that require authentication
const protectedPaths = ["/admin", "/reseller"]

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if current path requires protection
  const isProtectedRoute = protectedPaths.some(path => pathname?.startsWith(path))

  useEffect(() => {
    // Simulate auth check (replace with actual auth logic if needed)
    setIsChecking(false)
  }, [])

  useEffect(() => {
    if (!isChecking && isProtectedRoute && !isLoggedIn) {
      router.push("/auth/login")
    }
  }, [isChecking, isProtectedRoute, isLoggedIn, router])

  // Show loading while checking auth on protected routes
  if (isChecking && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect screen for protected routes when not logged in
  if (isProtectedRoute && !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
