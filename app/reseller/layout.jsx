"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Zap, LogOut, User, Menu, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Imports i added myself
import { UserProvider, useUser } from "../contexts/UserContext"
import {AuthProvider, useAuth } from "../contexts/AuthContext"




// ✅ Renamed to ResellerLayoutContent
function ResellerLayoutContent({ children }) {
  const pathname = usePathname()

  
  // ✅ Use the user context hook
  const { Reseller, isLoadingReseller, isErrorReseller} = useUser()
  console.log("Called By ResellerLayoutContent:", Reseller)
  
  const isActive = (path) => {
    if (path === "/reseller") {
      return pathname === "/reseller"
    }
    return pathname?.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Zap className="h-6 w-6 fill-blue-500 text-blue-500" />
            <span>
              JoyBundle <span className="text-slate-400 font-normal text-sm ml-1">Reseller</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link 
                href="/reseller" 
                className={cn(
                  "transition-colors hover:text-slate-900",
                  isActive("/reseller") ? "text-blue-600" : "text-slate-600"
                )}
              >
                Dashboard
              </Link>
              <Link 
                href="/reseller/pricing" 
                className={cn(
                  "transition-colors hover:text-slate-900",
                  isActive("/reseller/pricing") ? "text-blue-600" : "text-slate-600"
                )}
              >
                Pricing
              </Link>
              <Link 
                href="/reseller/earnings" 
                className={cn(
                  "transition-colors hover:text-slate-900",
                  isActive("/reseller/earnings") ? "text-blue-600" : "text-slate-600"
                )}
              >
                Earnings
              </Link>
              <Link 
                href="/reseller/settings" 
                className={cn(
                  "transition-colors hover:text-slate-900",
                  isActive("/reseller/settings") ? "text-blue-600" : "text-slate-600"
                )}
              >
                Settings
              </Link>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block" />
            
            {/* ✅ Display user data from context */}
            <div className="flex items-center gap-3">
              {isLoadingReseller ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                </div>
              ) : (
                <>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{Reseller?.name || "User"}</p>
                    <p className="text-xs text-slate-500">ID: {Reseller?.resellerCode || "---"}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                </>
              )}
              
              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="flex flex-col gap-6 mt-8">
                      <div className="pb-4 border-b">
                        <p className="font-medium">{Reseller?.name || "User"}</p>
                        <p className="text-xs text-slate-500">ID: {Reseller?.resellerCode || "---"}</p>
                      </div>
                      <Link 
                        href="/reseller" 
                        className={cn(
                          "font-medium text-lg transition-colors",
                          isActive("/reseller") ? "text-blue-600" : "text-slate-900"
                        )}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        href="/reseller/pricing" 
                        className={cn(
                          "font-medium text-lg transition-colors",
                          isActive("/reseller/pricing") ? "text-blue-600" : "text-slate-900"
                        )}
                      >
                        Pricing
                      </Link>
                      <Link 
                        href="/reseller/earnings" 
                        className={cn(
                          "font-medium text-lg transition-colors",
                          isActive("/reseller/earnings") ? "text-blue-600" : "text-slate-900"
                        )}
                      >
                        Earnings
                      </Link>
                      <Link 
                        href="/reseller/settings" 
                        className={cn(
                          "font-medium text-lg transition-colors",
                          isActive("/reseller/settings") ? "text-blue-600" : "text-slate-900"
                        )}
                      >
                        Settings
                      </Link>
                      <Button variant="ghost" className="justify-start px-0 text-red-600 hover:text-red-700 hover:bg-transparent mt-auto">
                        <LogOut className="mr-2 h-5 w-5" />
                        Sign Out
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600 hidden md:flex">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

// ✅ Main layout component wraps with UserProvider
export default function ResellerLayout({ children }) {

  console.log("ResellerLayout rendered")

  return (
   <AuthProvider>  
      <UserProvider>
        <ResellerLayoutContent>
          {children}
        </ResellerLayoutContent>
      </UserProvider>
  </AuthProvider>

  )
}