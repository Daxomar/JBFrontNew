"use client"

import { createContext, useContext, useState,useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Default to true as requested
  const [isLoading, setIsLoading] = useState(false)
  const [loadedUser, setLoadedUser] = useState(null)

  const clearAuth = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
  }

  useEffect(() => {
    verifyAuthWithBackend()
  }, [])



   const verifyAuthWithBackend = async () => {


    try {
      console.log("🔍 Verifying authentication with backend...")
      setIsLoggedIn(false)
      setIsLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/is-auth`,
        {
          method: "GET",
          credentials: "include", // Send JWT cookie
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        
        if (data.success && data.user) {
          console.log("✅ Authentication verified:", data.user.email)
         
          
          // Sync to localStorage as backup (but backend is source of truth)
          setLoadedUser(data.user)
          localStorage.setItem("user", JSON.stringify(data.user))
          setIsLoggedIn(true)
          setIsLoading(false)
        } else {
          console.log("❌ Authentication failed: No user data")
          clearAuth()

        }
      } else {
        console.log("❌ Authentication failed: Invalid token")
        clearAuth()
      }
    } catch (error) {
      console.error("❌ Auth verification error:", error)
      clearAuth()
    } finally {
      setIsLoading(false)
    
    }
  }




  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-cyan-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading....</p>
        </div>
      </div>
    )
    // Alternatively, you could return a <Login /> component here:
    // return <LoginForm onLogin={() => setIsLoggedIn(true)} />
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
