

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, CheckCircle, TrendingUp, Users, DollarSign, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useUser } from "../contexts/UserContext"
import { fetchWithAuth } from "@/lib/utility/fetchWithAuth"

// Base URL - move to .env later


// Manually set userId for now - REMEMBER TO REPLACE WITH AUTH


export default function ResellerDashboard() {
  const [copied, setCopied] = useState(false)


  const { Reseller, isLoadingReseller, isErrorReseller} = useUser()

  // ============================================
  // API FUNCTIONS
  // ============================================

  // Fetch referral link
  // const fetchReferralLink = async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/reseller-link`, {
  //       method: "GET",
  //       headers: { 
  //         "Content-Type": "application/json",
  //         "ngrok-skip-browser-warning": "true"
  //       },
  //       credentials: "include",
  //     })

  //     if (!response.ok) {
  //       const err = await response.json().catch(() => ({}));
  //       throw new Error(err.message || "Failed to fetch referral link");
  //     }

  //     const data = await response.json();

  //     if (!data.success) {
  //       throw new Error(data.message || "Failed to fetch referral link");
  //     }

  //     return data; // { success, message, referralURL }
  //   } catch (error) {
  //     console.error("Fetch referral link error:", error.message);
  //     toast.error(error.message || "Unexpected error");
  //     throw error;
  //   }
  // };




  const fetchReferralLink = async () => {
    try {
      const response = await fetchWithAuth('/users/reseller-link', {
        method: "GET",
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch referral link");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch referral link");
      }

      return data; // { success, message, referralURL }
    } catch (error) {
      console.error("Fetch referral link error:", error.message);
      toast.error(error.message || "Unexpected error");
      throw error;
    }
  };

  // Fetch reseller data (stats from user profile)
  // const fetchResellerData = async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/users/me?userId=${CURRENT_USER_ID}`, {
  //       method: "GET",
  //       headers: { 
  //         "Content-Type": "application/json",
  //         "ngrok-skip-browser-warning": "true"
  //       },
  //     });

  //     if (!response.ok) {
  //       const err = await response.json().catch(() => ({}));
  //       throw new Error(err.message || "Failed to fetch reseller data");
  //     }

  //     const data = await response.json();

  //     if (!data.success) {
  //       throw new Error(data.message || "Failed to fetch reseller data");
  //     }

  //     return data; // { success, data:{} }
  //   } catch (error) {
  //     console.error("Fetch reseller data error:", error.message);
  //     toast.error(error.message || "Failed to load reseller data");
  //     throw error;
  //   }
  // };

  // Fetch recent commissions
  const fetchRecentCommissions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/commissions/my-commissions?&page=1&limit=5`, 
        {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
        credentials: "include",
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch commissions");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch commissions");
      }

      return data; // { success, commissions: [...], pagination: {...} }
    } catch (error) {
      console.error("Fetch commissions error:", error.message);
      toast.error(error.message || "Failed to load commissions");
      throw error;
    }
  };

  // ============================================
  // REACT QUERY HOOKS
  // ============================================

  // Query: Referral Link
  const {
    data: referralData,
    isLoading: isLoadingReferral,
    isError: isErrorReferral,
  } = useQuery({
    queryKey: ["referralLink", Reseller?._id],
    queryFn: fetchReferralLink,
    enabled: !!Reseller?._id
  });

  // Query: Reseller Data (replaces commission stats)
  // const {
  //   data: resellerData,
  //   isLoading: isLoadingReseller,
  //   isError: isErrorReseller,
  // } = useQuery({
  //   queryKey: ["resellerData", CURRENT_USER_ID],
  //   queryFn: fetchResellerData,
  // });

  // Query: Recent Commissions
  const {
    data: commissionsData,
    isLoading: isLoadingCommissions,
    isError: isErrorCommissions,
  } = useQuery({
    queryKey: ["recentCommissions", Reseller?._id],
    queryFn: fetchRecentCommissions,
    enabled: !!Reseller?._id
  });

  // ============================================
  // HANDLERS
  // ============================================

  const copyLink = () => {
    if (referralData?.referralURL) {
      navigator.clipboard.writeText(referralData.referralURL)
      setCopied(true)
      toast.success("Link copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ============================================
  // DATA EXTRACTION
  // ============================================

  const referralLink = referralData?.referralURL || "Loading..."

  console.log("Reseller Data:", Reseller)

  
 
  const stats = {
    totalEarned: Reseller?.totalCommissionsEarned || 0,
    totalPaid: Reseller?.totalCommissionsPaidOut || 0,
    totalSales: Reseller?.totalSales || 0,
    pendingPayout: (Reseller?.totalCommissionsEarned || 0) - (Reseller?.totalCommissionsPaidOut || 0)
  }
  const commissions = commissionsData?.commissions || []

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-8">
      {/* Welcome & Link Section */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
          <p className="text-slate-500">{Reseller?.name}</p>
        </div>
       
       
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Track your sales and commissions.</p>
        </div>
        <Card className="w-full md:w-auto min-w-0 bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-600 mb-1">Your Referral Link</p>
              <div className="flex items-center gap-2 bg-white rounded-md border px-3 py-2 w-full">
                {isLoadingReferral ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <code className="text-sm flex-1 truncate">{referralLink}</code>
                )}
              </div>
            </div>
            <Button 
              size="icon" 
              onClick={copyLink} 
              disabled={isLoadingReferral}
              className={copied ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Earnings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {isLoadingReseller ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-slate-500">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalEarned)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total commission earned
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sales</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {isLoadingReseller ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-slate-500">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalSales}</div>
                <p className="text-xs text-muted-foreground mt-1">Completed orders</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Payout */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Payout</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            {isLoadingReseller ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-slate-500">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats.pendingPayout)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(stats.totalPaid)} already paid
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Commissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commissions</CardTitle>
          <CardDescription>Latest earnings from your referral link.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="min-w-[120px]">Bundle</TableHead>
                  <TableHead>Order Amount</TableHead>
                  <TableHead className="text-right">Profits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingCommissions ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        <span className="text-slate-500">Loading commissions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : commissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No commissions yet. Share your referral link to start earning!
                    </TableCell>
                  </TableRow>
                ) : (
                  commissions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-slate-500 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{item.orderId}</TableCell>
                      <TableCell className="whitespace-nowrap">{item.bundle}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCurrency(item.orderAmount)}</TableCell>
                      <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">
                        +{formatCurrency(item.commission)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}