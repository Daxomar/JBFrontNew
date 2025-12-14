"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, CheckCircle, XCircle, Eye, Clock } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock Pending Payout Requests from Resellers
const mockPendingPayouts = [
  {
    id: "PAYOUT-001234",
    date: "2023-11-22 10:45 AM",
    phone: "024 555 0199",
    resellerName: "Kwame Asante",
    amount: 150.0,
    method: "MTN MoMo",
    momoNumber: "024 555 0199",
    status: "pending",
    walletBalance: 320.0,
  },
  {
    id: "PAYOUT-001235",
    date: "2023-11-22 11:12 AM",
    phone: "050 555 0200",
    resellerName: "Ama Serwaa",
    amount: 280.0,
    method: "Vodafone Cash",
    momoNumber: "050 555 0200",
    status: "pending",
    walletBalance: 450.0,
  },
  {
    id: "PAYOUT-001236",
    date: "2023-11-22 11:30 AM",
    phone: "027 555 0300",
    resellerName: "Kofi Mensah",
    amount: 500.0,
    method: "MTN MoMo",
    momoNumber: "027 555 0300",
    status: "pending",
    walletBalance: 780.0,
  },
  {
    id: "PAYOUT-001237",
    date: "2023-11-22 12:05 PM",
    phone: "020 555 0400",
    resellerName: "Yaa Pokua",
    amount: 75.0,
    method: "AirtelTigo Money",
    momoNumber: "020 555 0400",
    status: "pending",
    walletBalance: 120.0,
  },
]

export default function ConfirmPaymentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [payouts, setPayouts] = useState(mockPendingPayouts)
  const [selectedPayout, setSelectedPayout] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const filteredPayouts = payouts.filter(
    (payout) =>
      payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.phone.includes(searchTerm) ||
      payout.resellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.momoNumber.includes(searchTerm)
  )

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout)
    setIsViewDialogOpen(true)
  }

  const handleConfirmPayout = (payout) => {
    setSelectedPayout(payout)
    setIsConfirmDialogOpen(true)
  }

  const handleRejectPayout = (payout) => {
    setSelectedPayout(payout)
    setIsRejectDialogOpen(true)
  }

  const confirmPayout = () => {
    setPayouts(payouts.filter((p) => p.id !== selectedPayout.id))
    setIsConfirmDialogOpen(false)
    setSelectedPayout(null)
  }

  const rejectPayout = () => {
    setPayouts(payouts.filter((p) => p.id !== selectedPayout.id))
    setIsRejectDialogOpen(false)
    setRejectReason("")
    setSelectedPayout(null)
  }

  const pendingCount = payouts.filter((p) => p.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Confirm Payouts</h2>
          <p className="text-muted-foreground">Review and confirm reseller payout requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Clock className="w-4 h-4" />
            {pendingCount} Pending
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payout Requests</CardTitle>
          <CardDescription>Review reseller payout requests and confirm after processing via MoMo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by ID, name, or MoMo number..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Reseller</TableHead>
                  <TableHead>MoMo Number</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No pending payout requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                      <TableCell className="text-xs text-slate-500">{payout.date}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payout.resellerName}</p>
                          <p className="text-xs text-slate-500">{payout.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{payout.momoNumber}</TableCell>
                      <TableCell className="text-xs">{payout.method}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100" variant="secondary">
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewDetails(payout)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleConfirmPayout(payout)}
                            title="Confirm Payout"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRejectPayout(payout)}
                            title="Reject Payout"
                          >
                            <XCircle className="w-4 h-4" />
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

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payout Request Details</DialogTitle>
            <DialogDescription>Review the payout request information before processing.</DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Payout ID</p>
                  <p className="font-mono font-medium">{selectedPayout.id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Amount</p>
                  <p className="font-medium text-lg">{formatCurrency(selectedPayout.amount)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Reseller</p>
                  <p className="font-medium">{selectedPayout.resellerName}</p>
                  <p className="text-xs text-slate-500">{selectedPayout.phone}</p>
                </div>
                <div>
                  <p className="text-slate-500">Wallet Balance</p>
                  <p className="font-medium">{formatCurrency(selectedPayout.walletBalance)}</p>
                </div>
                <div>
                  <p className="text-slate-500">MoMo Number</p>
                  <p className="font-mono font-medium">{selectedPayout.momoNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500">Method</p>
                  <p className="font-medium">{selectedPayout.method}</p>
                </div>
              </div>
              <div className="border rounded-md p-4 bg-yellow-50 border-yellow-200">
                <p className="text-sm font-medium text-yellow-800">Send {formatCurrency(selectedPayout.amount)} to:</p>
                <p className="text-lg font-mono font-bold text-yellow-900 mt-1">{selectedPayout.momoNumber}</p>
                <p className="text-sm text-yellow-700 mt-1">via {selectedPayout.method}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setIsViewDialogOpen(false)
                handleConfirmPayout(selectedPayout)
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Sent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Payout Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payout Sent</DialogTitle>
            <DialogDescription>
              Confirm that you have sent the payout to the reseller via MoMo. This will mark the request as completed.
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="py-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedPayout.resellerName}</p>
                    <p className="text-sm text-slate-500">{selectedPayout.momoNumber} • {selectedPayout.method}</p>
                  </div>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPayout.amount)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={confirmPayout}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Sent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Payout Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Payout Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payout request. The reseller will be notified.
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedPayout.resellerName}</p>
                    <p className="text-sm text-slate-500">{selectedPayout.momoNumber}</p>
                  </div>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(selectedPayout.amount)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={rejectPayout}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
