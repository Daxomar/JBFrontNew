"use client"

import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

const UserContext = createContext(null)


const CURRENT_USER_ID = "6942af84c58df50e5dd16d00"

export function UserProvider({ children }) {


    console.log("🔵 UserProvider mounted") // ← Add this

  const fetchUserData = async () => {

    console.log("🟢 fetchUserData called")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      credentials: "include",
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to fetch user data")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch user data")
      }

     
      console.log("DATA . DATA", data)

     return data.data;

    } catch (error) {
      console.error("Fetch user data error:", error.message)
      toast.error(error.message || "Failed to load user data")
      throw error
    }
  }

  const {
    data: Reseller,
    isLoading:isLoadingReseller,
    isError:isErrorReseller,
    refetch,
  } = useQuery({
    queryKey: ["userData",],
    queryFn: fetchUserData,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })


  console.log("OVER HEREE", Reseller)

  return (
    <UserContext.Provider value={{ Reseller, isLoadingReseller, isErrorReseller, refetch }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}