"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, MoreHorizontal, Plus, Search, ArrowUpDown, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BulkTimestampSelector } from "@/components/admin/bulk-timestamp-selector"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"



// Send Invite Schema
const sendInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export default function ResellersPage() {
  const queryClient = useQueryClient()
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedResellers, setSelectedResellers] = useState([])

  // React Hook Form for invite
  const {
    register,
    handleSubmit: handleInvite,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(sendInviteSchema),
  })

  // Fetch all resellers
  const {
    data: resellersResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["resellers"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to fetch resellers")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch resellers")
      }

      return result
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute
  })

  const resellers = resellersResponse?.data || []
  const analytics = resellersResponse?.analytics || {
    totalResellers: 0,
    activeResellers: 0,
    pendingResellers: 0,
    totalCommissionEarned: 0,
    totalCommissionPaidOut: 0,
    availableBalance: 0,
    currency: "GHS",
  }

  // Invite reseller mutation
  const inviteMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to send invitation")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to send invitation")
      }

      return result
    },
    onSuccess: (data) => {
      toast.success(`Invitation sent to ${data.email}`)
      reset()
      setIsInviteOpen(false)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send invitation")
    },
  })

  // Approve reseller mutation
  const approveMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to approve reseller")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to approve reseller")
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resellers"])
      toast.success("Reseller approved successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to approve reseller")
    },
  })

  // Reject reseller mutation
  const rejectMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to reject reseller")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to reject reseller")
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resellers"])
      toast.success("Reseller rejected/suspended successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject reseller")
    },
  })

  const onSubmitInvite = (data) => {
    inviteMutation.mutate(data)
  }

  const updateStatus = (id, newStatus) => {
    if (newStatus === "active") {
      approveMutation.mutate(id)
    } else if (newStatus === "suspended") {
      rejectMutation.mutate(id)
    }
  }

  // Filter and sort resellers
  const filteredResellers = useMemo(() => {
    let result = [...resellers]

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r._id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter)
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "sales":
          comparison = (a.salesVolume || 0) - (b.salesVolume || 0)
          break
        case "joined":
          comparison = new Date(a.createdAt) - new Date(b.createdAt)
          break
        default:
          comparison = 0
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    return result
  }, [resellers, searchQuery, statusFilter, sortBy, sortOrder])

  const toggleSelectReseller = (resellerId) => {
    setSelectedResellers((prev) =>
      prev.includes(resellerId) ? prev.filter((id) => id !== resellerId) : [...prev, resellerId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedResellers.length === filteredResellers.length) {
      setSelectedResellers([])
    } else {
      setSelectedResellers(filteredResellers.map((r) => r._id))
    }
  }

  const handleBulkAction = (action) => {
    if (action === "approve") {
      selectedResellers.forEach((id) => {
        const reseller = resellers.find((r) => r._id === id)
        if (reseller && reseller.status === "pending") {
          approveMutation.mutate(id)
        }
      })
      setSelectedResellers([])
    } else if (action === "reject") {
      selectedResellers.forEach((id) => {
        const reseller = resellers.find((r) => r._id === id)
        if (reseller && reseller.status === "pending") {
          rejectMutation.mutate(id)
        }
      })
      setSelectedResellers([])
    }
  }

  

  // Calculate stats from analytics
  const totalActiveResellers = analytics?.activeResellers
  const totalResellers = analytics?.totalResellers
  const pendingCount = analytics?.pendingResellers
  const totalSalesVolume = analytics?.totalCommissionEarned

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reseller Management</h2>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Reseller
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px] bg-white/95 shadow-2xl border border-slate-200">
            <form onSubmit={handleInvite(onSubmitInvite)}>
              <DialogHeader>
                <DialogTitle>Invite New Reseller</DialogTitle>
                <DialogDescription>Send an invitation email to add a new reseller to your platform.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="reseller@example.com"
                    disabled={inviteMutation.isPending}
                    {...register("email")}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>
              <DialogFooter className="mt-2 flex flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInviteOpen(false)}
                  disabled={inviteMutation.isPending}
                  className="min-w-[90px] justify-center border-2 border-black"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="min-w-[90px] justify-center border-2 border-black bg-green-500 text-white hover:bg-green-800"
                  disabled={inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Invite"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Active Resellers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">{totalActiveResellers}</div>

            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sales Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">GHS {totalSalesVolume.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Selection */}
      {selectedResellers.length > 0 && (
        <BulkTimestampSelector
          onBulkAction={handleBulkAction}
          selectedCount={selectedResellers.length}
          totalCount={filteredResellers.length}
          actions={["approve", "reject"]}
        />
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle>All Resellers</CardTitle>
              <CardDescription>Manage reseller accounts and approvals.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="joined">Joined Date</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => queryClient.invalidateQueries(["resellers"])}
                className="border-2 border-slate-600 bg-blue-500 text-white hover:bg-green-700"
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={selectedResellers.length === filteredResellers.length && filteredResellers.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Email</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Total Sales</TableHead>
                  <TableHead className="whitespace-nowrap">Joined Date</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        <p className="text-slate-500">Loading resellers...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <X className="h-8 w-8 text-red-500" />
                        <p className="text-red-600 font-medium">Failed to load resellers</p>
                        <p className="text-sm text-slate-500">{error?.message}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => queryClient.invalidateQueries(["resellers"])}
                          className="mt-2"
                        >
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredResellers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No resellers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResellers.map((reseller) => (
                    <TableRow
                      key={reseller._id}
                      className={selectedResellers.includes(reseller._id) ? "bg-slate-50" : ""}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedResellers.includes(reseller._id)}
                          onChange={() => toggleSelectReseller(reseller._id)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{reseller.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{reseller.email}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={
                            reseller.status === "active"
                              ? "default"
                              : reseller.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className={
                            reseller.status === "active"
                              ? "bg-green-500 hover:bg-green-600"
                              : reseller.status === "pending"
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : ""
                          }
                        >
                          {reseller.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        GHS {reseller.salesVolume?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(reseller.createdAt)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          {reseller.status === "pending" && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:bg-green-50"
                                title="Approve"
                                onClick={() => updateStatus(reseller._id, "active")}
                                disabled={approveMutation.isPending}
                              >
                                {approveMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                                title="Reject"
                                onClick={() => updateStatus(reseller._id, "suspended")}
                                disabled={rejectMutation.isPending}
                              >
                                {rejectMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </Button>
                            </>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
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