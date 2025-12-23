
"use client"


import { AdminSidebar } from "@/components/admin/sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Loader2, User,LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"




//my own additions
import { UserProvider, useUser } from "../contexts/UserContext"
import {AuthProvider, useAuth } from "../contexts/AuthContext"
import { TransactionProvider, useTransactions } from "../contexts/TransactionContext"

 function AdminLayoutContent({ children }) {

const { Reseller, isLoadingReseller, isErrorReseller} = useUser()


  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 z-50">
        <AdminSidebar />
      </div>

      <div className="md:pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-slate-800 text-white">
                <AdminSidebar className="border-none flex static w-full h-full" />
              </SheetContent>
            </Sheet>
            <h1 className="font-semibold text-lg text-slate-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-500">System Operational</span>
            </div> */}
            <div className=" h-8 rounded-full  flex items-center justify-center font-bold text-slate-600  gap-4 w-full">
               {isLoadingReseller ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                </div>
              ) : (
                <>
                  <div className="text-right hidden sm:block ">
                    <p className="text-sm font-medium">{Reseller?.name || "User"}</p>
                    
                    <p className="text-xs ">{Reseller?.role || "---"}</p>
                    
                  </div>
                  
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                </>
              )}
            </div>

              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600 hidden md:flex">
                <LogOut className="h-5 w-5" />
              </Button>
          </div>
        </header>
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  )
}




// ✅ Main layout component wraps with UserProvider
export default function AdminLayout({ children }) {

  console.log("ResellerLayout rendered")

  return (
    

 <AuthProvider>  
  <UserProvider>
    <TransactionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </TransactionProvider> 
    </UserProvider>
    </AuthProvider>
  )
}
