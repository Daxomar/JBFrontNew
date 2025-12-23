// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Switch } from "@/components/ui/switch"
// import { 
//   DollarSign, 
//   Save, 
//   Info, 
//   Edit3, 
//   Check, 
//   TrendingUp,
//   Percent,
//   Coins
// } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
// import { formatCurrency, NETWORKS } from "@/lib/utils"

// // Mock base bundles from admin
// const baseBundles = [
//   { id: 1, name: "1GB Data", basePrice: 12, network: "mtn", volume: "1GB" },
//   { id: 2, name: "2GB Data", basePrice: 22, network: "mtn", volume: "2GB" },
//   { id: 3, name: "5GB Data", basePrice: 50, network: "mtn", volume: "5GB" },
//   { id: 4, name: "10GB Data", basePrice: 95, network: "mtn", volume: "10GB" },
//   { id: 5, name: "1GB Data", basePrice: 11, network: "telecel", volume: "1GB" },
//   { id: 6, name: "5GB Data", basePrice: 48, network: "telecel", volume: "5GB" },
//   { id: 7, name: "2GB Data", basePrice: 20, network: "at", volume: "2GB" },
//   { id: 8, name: "5GB Data", basePrice: 45, network: "at", volume: "5GB" },
// ]

// // Preset commission options
// const commissionPresets = [
//   { id: "low", label: "Low Margin", amount: 2, description: "Add GHS 2.00 to all bundles" },
//   { id: "medium", label: "Medium Margin", amount: 5, description: "Add GHS 5.00 to all bundles" },
//   { id: "high", label: "High Margin", amount: 10, description: "Add GHS 10.00 to all bundles" },
// ]

// export default function ResellerPricingPage() {
//   const { toast } = useToast()
//   const [pricingMode, setPricingMode] = useState("preset") // "preset" or "custom"
//   const [selectedPreset, setSelectedPreset] = useState("medium")
//   const [globalCommission, setGlobalCommission] = useState(5)
//   const [customCommissions, setCustomCommissions] = useState(
//     baseBundles.reduce((acc, bundle) => ({ ...acc, [bundle.id]: 5 }), {})
//   )
//   const [isSaving, setIsSaving] = useState(false)

//   const getCommissionForBundle = (bundleId) => {
//     if (pricingMode === "preset") {
//       const preset = commissionPresets.find(p => p.id === selectedPreset)
//       return preset?.amount || 5
//     }
//     return customCommissions[bundleId] || 0
//   }

//   const handleCustomCommissionChange = (bundleId, value) => {
//     setCustomCommissions(prev => ({
//       ...prev,
//       [bundleId]: parseFloat(value) || 0
//     }))
//   }

//   const applyGlobalCommission = () => {
//     const newCommissions = baseBundles.reduce((acc, bundle) => ({
//       ...acc,
//       [bundle.id]: globalCommission
//     }), {})
//     setCustomCommissions(newCommissions)
//     toast({
//       title: "Global Commission Applied",
//       description: `GHS ${globalCommission.toFixed(2)} commission applied to all bundles`,
//     })
//   }

//   const handleSave = async () => {
//     setIsSaving(true)
    
//     // Simulate API call
//     setTimeout(() => {
//       setIsSaving(false)
//       toast({
//         title: "Pricing Saved",
//         description: "Your bundle pricing has been updated successfully.",
//       })
//     }, 1000)
//   }

//   const totalPotentialProfit = baseBundles.reduce((sum, bundle) => {
//     return sum + getCommissionForBundle(bundle.id)
//   }, 0)

//   const avgCommission = totalPotentialProfit / baseBundles.length

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900">Bundle Pricing</h1>
//         <p className="text-slate-500 mt-1">Set your commission on each bundle to determine your selling prices</p>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">Total Bundles</CardTitle>
//             <Coins className="h-4 w-4 text-slate-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{baseBundles.length}</div>
//             <p className="text-xs text-muted-foreground mt-1">Available for resale</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">Avg. Commission</CardTitle>
//             <TrendingUp className="h-4 w-4 text-slate-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">{formatCurrency(avgCommission)}</div>
//             <p className="text-xs text-muted-foreground mt-1">Per bundle sold</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">Pricing Mode</CardTitle>
//             <DollarSign className="h-4 w-4 text-slate-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold capitalize">{pricingMode}</div>
//             <p className="text-xs text-muted-foreground mt-1">
//               {pricingMode === "preset" ? "Using preset margins" : "Custom per bundle"}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Left Column - Pricing Mode Selection */}
//         <div className="space-y-6">
//           {/* Pricing Mode Toggle */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <DollarSign className="h-5 w-5" />
//                 Pricing Mode
//               </CardTitle>
//               <CardDescription>Choose how you want to set your prices</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                 <div>
//                   <Label className="text-sm font-medium">Custom Pricing</Label>
//                   <p className="text-xs text-slate-500">Set individual commission per bundle</p>
//                 </div>
//                 <Switch 
//                   checked={pricingMode === "custom"} 
//                   onCheckedChange={(checked) => setPricingMode(checked ? "custom" : "preset")}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Preset Options */}
//           {pricingMode === "preset" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base">Quick Presets</CardTitle>
//                 <CardDescription>Select a commission level for all bundles</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <RadioGroup value={selectedPreset} onValueChange={setSelectedPreset} className="space-y-3">
//                   {commissionPresets.map((preset) => (
//                     <div 
//                       key={preset.id}
//                       className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
//                         selectedPreset === preset.id 
//                           ? "border-cyan-500 bg-cyan-50" 
//                           : "border-slate-200 hover:border-slate-300"
//                       }`}
//                       onClick={() => setSelectedPreset(preset.id)}
//                     >
//                       <RadioGroupItem value={preset.id} id={preset.id} className="sr-only" />
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <Label htmlFor={preset.id} className="font-medium cursor-pointer">
//                             {preset.label}
//                           </Label>
//                           {selectedPreset === preset.id && (
//                             <Check className="h-4 w-4 text-cyan-500" />
//                           )}
//                         </div>
//                         <p className="text-xl font-bold text-green-600 mt-1">
//                           +{formatCurrency(preset.amount)}
//                         </p>
//                         <p className="text-xs text-slate-500">{preset.description}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </RadioGroup>
//               </CardContent>
//             </Card>
//           )}

//           {/* Global Commission for Custom Mode */}
//           {pricingMode === "custom" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-base flex items-center gap-2">
//                   <Percent className="h-4 w-4" />
//                   Apply Global Commission
//                 </CardTitle>
//                 <CardDescription>Set the same commission for all bundles at once</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Commission Amount (GHS)</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       type="number"
//                       step="0.50"
//                       min="0"
//                       value={globalCommission}
//                       onChange={(e) => setGlobalCommission(parseFloat(e.target.value) || 0)}
//                       className="flex-1"
//                     />
//                     <Button onClick={applyGlobalCommission} variant="outline">
//                       Apply All
//                     </Button>
//                   </div>
//                 </div>
                
//                 {/* Quick amount buttons */}
//                 <div className="flex flex-wrap gap-2">
//                   {[2, 3, 5, 7, 10].map((amount) => (
//                     <Button
//                       key={amount}
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setGlobalCommission(amount)}
//                       className={globalCommission === amount ? "border-cyan-500 bg-cyan-50" : ""}
//                     >
//                       +GHS {amount}
//                     </Button>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Info Card */}
//           <Card className="bg-blue-50 border-blue-100">
//             <CardContent className="p-4">
//               <div className="flex gap-3">
//                 <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-blue-900">How it works</p>
//                   <p className="text-sm text-blue-700 mt-1">
//                     Your selling price = Base price + Your commission. 
//                     The commission you set is your profit per sale.
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column - Bundle Pricing Table */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                   <CardTitle>Bundle Prices</CardTitle>
//                   <CardDescription>
//                     {pricingMode === "preset" 
//                       ? "Prices calculated using selected preset" 
//                       : "Set custom commission for each bundle"}
//                   </CardDescription>
//                 </div>
//                 <Button 
//                   onClick={handleSave} 
//                   disabled={isSaving}
//                   className="bg-cyan-500 hover:bg-cyan-600 w-full sm:w-auto"
//                 >
//                   <Save className="mr-2 h-4 w-4" />
//                   {isSaving ? "Saving..." : "Save Prices"}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Bundle</TableHead>
//                       <TableHead>Network</TableHead>
//                       <TableHead className="whitespace-nowrap">Base Price</TableHead>
//                       <TableHead className="whitespace-nowrap">Your Commission</TableHead>
//                       <TableHead className="text-right whitespace-nowrap">Selling Price</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {baseBundles.map((bundle) => {
//                       const commission = getCommissionForBundle(bundle.id)
//                       const sellingPrice = bundle.basePrice + commission
//                       const net = NETWORKS?.find((n) => n.id === bundle.network)
                      
//                       return (
//                         <TableRow key={bundle.id}>
//                           <TableCell className="whitespace-nowrap">
//                             <div>
//                               <p className="font-medium">{bundle.name}</p>
//                               <p className="text-xs text-slate-500">{bundle.volume}</p>
//                             </div>
//                           </TableCell>
//                           <TableCell className="whitespace-nowrap">
//                             <div className="flex items-center gap-2">
//                               {net?.logo && (
//                                 <img
//                                   src={net.logo}
//                                   alt={net.name}
//                                   className="h-5 w-5 rounded-full border border-slate-200 bg-white object-contain"
//                                 />
//                               )}
//                               <Badge variant="outline" className="text-xs">
//                                 {net?.name ?? bundle.network.toUpperCase()}
//                               </Badge>
//                             </div>
//                           </TableCell>
//                           <TableCell className="text-slate-500 whitespace-nowrap">
//                             {formatCurrency(bundle.basePrice)}
//                           </TableCell>
//                           <TableCell className="whitespace-nowrap">
//                             {pricingMode === "custom" ? (
//                               <div className="flex items-center gap-1">
//                                 <span className="text-slate-400 text-sm">+</span>
//                                 <Input
//                                   type="number"
//                                   step="0.50"
//                                   min="0"
//                                   value={customCommissions[bundle.id] || ""}
//                                   onChange={(e) => handleCustomCommissionChange(bundle.id, e.target.value)}
//                                   className="w-20 h-8 text-sm"
//                                 />
//                               </div>
//                             ) : (
//                               <span className="text-green-600 font-medium">
//                                 +{formatCurrency(commission)}
//                               </span>
//                             )}
//                           </TableCell>
//                           <TableCell className="text-right whitespace-nowrap">
//                             <span className="font-bold text-slate-900">
//                               {formatCurrency(sellingPrice)}
//                             </span>
//                           </TableCell>
//                         </TableRow>
//                       )
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// const formatCurrency = (amount) => `GHS ${amount?.toFixed(2) || '0.00'}`

// const NETWORKS = [
//   { id: "mtn", name: "MTN", color: "bg-yellow-500" },
//   { id: "telecel", name: "Telecel", color: "bg-red-500" },
//   { id: "at", name: "AirtelTigo", color: "bg-blue-500" },
// ]

// // Toast utility
// const toast = {
//   success: (message) => {
//     // You can replace this with your actual toast implementation
//     alert(`✓ ${message}`)
//   },
//   error: (message) => {
//     alert(`✗ ${message}`)
//   }
// }

// export default function ResellerPricingPage() {
//   const queryClient = useQueryClient()
//   const [editMode, setEditMode] = useState(false)
//   const [globalCommission, setGlobalCommission] = useState(5)
//   const [localPrices, setLocalPrices] = useState({})

//   // Fetch bundles from database
//   const fetchBundles = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bundles/getBundleFromDb`, {
//         method: "GET",
//         headers: { 
//           "Content-Type": "application/json",
//           "ngrok-skip-browser-warning": "true"
//         },
//       })

//       if (!response.ok) {
//         const err = await response.json().catch(() => ({}))
//         throw new Error(err.message || "Failed to fetch bundles")
//       }

//       const data = await response.json()

//       if (!data.success) {
//         throw new Error(data.message || "Failed to fetch bundles")
//       }

//       return data.data // Return the bundles array
//     } catch (error) {
//       console.error("Fetch bundles error:", error.message)
//       throw error
//     }
//   }

//   // Fetch reseller's custom pricing
//   const fetchResellerPricing = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reseller/pricing`, {
//         method: "GET",
//         credentials: "include",
//         headers: { 
//           "Content-Type": "application/json",
//           "ngrok-skip-browser-warning": "true"
//         },
//       })

//       if (!response.ok) {
//         const err = await response.json().catch(() => ({}))
//         throw new Error(err.message || "Failed to fetch pricing")
//       }

//       const data = await response.json()

//       if (!data.success) {
//         throw new Error(data.message || "Failed to fetch pricing")
//       }

//       return data.data // Return bundles with pricing
//     } catch (error) {
//       console.error("Fetch pricing error:", error.message)
//       throw error
//     }
//   }

//   // Query for bundles
//   const { 
//     data: bundles, 
//     isLoading: isLoadingBundles 
//   } = useQuery({
//     queryKey: ["bundles"],
//     queryFn: fetchBundles,
//   })

//   // Query for reseller pricing
//   const { 
//     data: pricingData, 
//     isLoading: isLoadingPricing 
//   } = useQuery({
//     queryKey: ["resellerPricing"],
//     queryFn: fetchResellerPricing,
//     enabled: !!bundles, // Only fetch pricing after bundles are loaded
//   })

//   // Initialize local prices when pricing data loads
//   useEffect(() => {
//     if (pricingData) {
//       const priceMap = {}
//       pricingData.forEach(bundle => {
//         priceMap[bundle._id] = bundle.customPrice
//       })
//       setLocalPrices(priceMap)
//     }
//   }, [pricingData])

//   // Merge bundles with pricing data
//   const bundlesWithPricing = bundles?.map(bundle => {
//     const pricingInfo = pricingData?.find(p => p._id === bundle._id)
//     return {
//       ...bundle,
//       basePrice: bundle.price,
//       customPrice: pricingInfo?.customPrice || bundle.price,
//       commission: pricingInfo?.commission || 0,
//       hasCustomPrice: pricingInfo?.hasCustomPrice || false
//     }
//   }) || []

//   // Save bulk prices mutation
//   const savePricesMutation = useMutation({
//     mutationFn: async (prices) => {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reseller/pricing/bulk`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 
//           'Content-Type': 'application/json',
//           "ngrok-skip-browser-warning": "true"
//         },
//         body: JSON.stringify({ prices })
//       })

//       if (!response.ok) {
//         const err = await response.json().catch(() => ({}))
//         throw new Error(err.message || 'Failed to update prices')
//       }

//       const data = await response.json()
//       if (!data.success) {
//         throw new Error(data.message || 'Failed to update prices')
//       }

//       return data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['resellerPricing'])
//       setEditMode(false)
//       toast.success("Pricing updated successfully")
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to save prices")
//     }
//   })

//   // Global commission mutation
//   const globalCommissionMutation = useMutation({
//     mutationFn: async (commission) => {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reseller/pricing/global-commission`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 
//           'Content-Type': 'application/json',
//           "ngrok-skip-browser-warning": "true"
//         },
//         body: JSON.stringify({ commission })
//       })

//       if (!response.ok) {
//         const err = await response.json().catch(() => ({}))
//         throw new Error(err.message || 'Failed to apply commission')
//       }

//       const data = await response.json()
//       if (!data.success) {
//         throw new Error(data.message || 'Failed to apply commission')
//       }

//       return data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['resellerPricing'])
//       toast.success(`${formatCurrency(globalCommission)} commission applied to all bundles`)
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to apply commission")
//     }
//   })

//   const handlePriceChange = (bundleId, value) => {
//     const numValue = parseFloat(value)
//     if (!isNaN(numValue)) {
//       setLocalPrices(prev => ({ ...prev, [bundleId]: numValue }))
//     }
//   }

//   const handleSave = () => {
//     const prices = bundlesWithPricing.map(bundle => ({
//       bundleId: bundle._id,
//       customPrice: localPrices[bundle._id] || bundle.basePrice
//     }))
//     savePricesMutation.mutate(prices)
//   }

//   const handleApplyGlobal = () => {
//     globalCommissionMutation.mutate(globalCommission)
//   }

//   const totalCommission = bundlesWithPricing.reduce((sum, bundle) => {
//     const price = localPrices[bundle._id] || bundle.customPrice
//     return sum + (price - bundle.basePrice)
//   }, 0)

//   const avgCommission = bundlesWithPricing.length > 0 ? totalCommission / bundlesWithPricing.length : 0

//   const isLoading = isLoadingBundles || isLoadingPricing
//   const isSaving = savePricesMutation.isPending

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <svg className="animate-spin h-12 w-12 text-cyan-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//           </svg>
//           <p className="text-gray-600">Loading pricing data...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Bundle Pricing</h1>
//           <p className="text-gray-600 mt-1">Set your selling price for each bundle (must be above base price)</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-3">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Bundles</p>
//                 <p className="text-3xl font-bold mt-1">{bundlesWithPricing.length}</p>
//                 <p className="text-xs text-gray-500 mt-1">Available for resale</p>
//               </div>
//               <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
//                 <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Avg. Commission</p>
//                 <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(avgCommission)}</p>
//                 <p className="text-xs text-gray-500 mt-1">Per bundle sold</p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                 <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Edit Mode</p>
//                 <p className="text-3xl font-bold mt-1">{editMode ? 'On' : 'Off'}</p>
//                 <p className="text-xs text-gray-500 mt-1">{editMode ? 'Making changes' : 'Viewing prices'}</p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           {/* Left Column - Controls */}
//           <div className="space-y-6">
//             {/* Edit Mode Card */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                 </svg>
//                 Quick Actions
//               </h3>
//               <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium">Edit Prices</p>
//                   <p className="text-xs text-gray-500">Enable to modify individual prices</p>
//                 </div>
//                 <button
//                   onClick={() => setEditMode(!editMode)}
//                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                     editMode ? 'bg-cyan-600' : 'bg-gray-300'
//                   }`}
//                 >
//                   <span
//                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                       editMode ? 'translate-x-6' : 'translate-x-1'
//                     }`}
//                   />
//                 </button>
//               </div>
//             </div>

//             {/* Global Commission Card */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                 </svg>
//                 Apply Global Commission
//               </h3>
//               <p className="text-sm text-gray-600 mb-4">Add the same commission to all bundles at once</p>
              
//               <div className="space-y-3">
//                 <div>
//                   <label className="text-sm font-medium text-gray-700 block mb-2">Commission Amount (GHS)</label>
//                   <div className="flex gap-2">
//                     <input
//                       type="number"
//                       step="0.50"
//                       min="0"
//                       value={globalCommission}
//                       onChange={(e) => setGlobalCommission(parseFloat(e.target.value) || 0)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
//                     />
//                     <button
//                       onClick={handleApplyGlobal}
//                       disabled={globalCommissionMutation.isPending}
//                       className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
//                     >
//                       {globalCommissionMutation.isPending ? (
//                         <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                         </svg>
//                       ) : (
//                         'Apply'
//                       )}
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-wrap gap-2">
//                   {[2, 3, 5, 7, 10].map((amount) => (
//                     <button
//                       key={amount}
//                       onClick={() => setGlobalCommission(amount)}
//                       className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-colors ${
//                         globalCommission === amount
//                           ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
//                           : 'border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       +GHS {amount}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Info Card */}
//             <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
//               <div className="flex gap-3">
//                 <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <div>
//                   <p className="text-sm font-semibold text-blue-900">How it works</p>
//                   <p className="text-sm text-blue-700 mt-1">
//                     Your selling price must be equal to or above the base price. 
//                     The difference is your profit per sale.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Bundle Table */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow">
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div>
//                     <h2 className="text-xl font-semibold">Bundle Prices</h2>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {editMode 
//                         ? 'Edit prices individually (must be ≥ base price)' 
//                         : 'View your current pricing'}
//                     </p>
//                   </div>
//                   {editMode && (
//                     <button
//                       onClick={handleSave}
//                       disabled={isSaving}
//                       className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-2 font-medium"
//                     >
//                       {isSaving ? (
//                         <>
//                           <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                           </svg>
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
//                           </svg>
//                           Save All Prices
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bundle</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Price</th>
//                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {bundlesWithPricing.map((bundle) => {
//                       const currentPrice = localPrices[bundle._id] ?? bundle.customPrice
//                       const commission = currentPrice - bundle.basePrice
//                       const net = NETWORKS.find((n) => n.id === bundle.network)
//                       const isValid = currentPrice >= bundle.basePrice
                      
//                       return (
//                         <tr key={bundle._id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div>
//                               <p className="font-medium text-gray-900">{bundle.name}</p>
//                               <p className="text-xs text-gray-500">{bundle.volume}</p>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-2">
//                               <div className={`w-6 h-6 rounded-full ${net?.color} flex items-center justify-center`}>
//                                 <span className="text-white text-xs font-bold">{net?.name[0]}</span>
//                               </div>
//                               <span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-700">
//                                 {net?.name ?? bundle.network.toUpperCase()}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                             {formatCurrency(bundle.JBSP)}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {editMode ? (
//                               <input
//                                 type="number"
//                                 step="0.50"
//                                 min={bundle.JBSP}
//                                 value={currentPrice}
//                                 onChange={(e) => handlePriceChange(bundle._id, e.target.value)}
//                                 className={`w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-cyan-500 ${
//                                   !isValid ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                               />
//                             ) : (
//                               <span className="font-medium text-gray-900">
//                                 {formatCurrency(currentPrice)}
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right">
//                             <span className={`font-bold ${commission > 0 ? 'text-green-600' : 'text-gray-400'}`}>
//                               +{formatCurrency(commission)}
//                             </span>
//                           </td>
//                         </tr>
//                       )
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const formatCurrency = (amount) => `GHS ${amount?.toFixed(2) || '0.00'}`

const NETWORKS = [
  { id: "mtn", name: "MTN", color: "bg-yellow-500" },
  { id: "telecel", name: "Telecel", color: "bg-red-500" },
  { id: "at", name: "AirtelTigo", color: "bg-blue-500" },
]

export default function ResellerPricingPage() {
  const queryClient = useQueryClient()
  const [localPrices, setLocalPrices] = useState({})
  const [savingBundleId, setSavingBundleId] = useState(null)

  // Fetch bundles from database
  const fetchBundles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bundles/getBundleFromDb`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to fetch bundles")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch bundles")
      }

      return data
    } catch (error) {
      console.error("Fetch bundles error:", error.message)
      throw error
    }
  }

  // Fetch reseller's custom pricing
  const fetchResellerPricing = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resellerBundlePrice/pricing`, {
        method: "GET",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to fetch pricing")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch pricing")
      }

      return data.data
    } catch (error) {
      console.error("Fetch pricing error:", error.message)
      throw error
    }
  }

  // Query for bundles
  const { 
    data: bundlesDataSet, 
    isLoading: isLoadingBundles 
  } = useQuery({
    queryKey: ["bundles"],
    queryFn: fetchBundles,
  })


  const bundles = bundlesDataSet?.data

 console.log("BUNDLES OVER HERE",bundlesDataSet)

  // Query for reseller pricing
  const { 
    data: pricingData, 
    isLoading: isLoadingPricing 
  } = useQuery({
    queryKey: ["resellerPricing"],
    queryFn: fetchResellerPricing,
    enabled: !!bundles,
  })

  // Initialize local prices when pricing data loads
  useEffect(() => {
    if (pricingData) {
      const priceMap = {}
      pricingData.forEach(bundle => {
        priceMap[bundle._id] = bundle.customPrice
      })
      setLocalPrices(priceMap)
    }
  }, [pricingData])

  // Merge bundles with pricing data
  const bundlesWithPricing = bundles?.map(bundle => {
    const pricingInfo = pricingData?.find(p => p._id === bundle._id)
    return {
      ...bundle,
      basePrice: bundle.JBSP || bundle.price,
      customPrice: pricingInfo?.customPrice || bundle.JBSP || bundle.price,
      commission: pricingInfo?.commission || 0,
      hasCustomPrice: pricingInfo?.hasCustomPrice || false
    }
  }) || []

  // Save individual bundle price mutation
  const savePriceMutation = useMutation({
    mutationFn: async ({ bundleId, customPrice }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resellerBundlePrice/pricing/set`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ bundleId, customPrice })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to update price')
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Failed to update price')
      }

      return data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['resellerPricing'])
      setSavingBundleId(null)
      toast.success("Price updated successfully")
    },
    onError: (error, variables) => {
      setSavingBundleId(null)
      toast.error(error.message || "Failed to save price")
    }
  })

  const handlePriceChange = (bundleId, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setLocalPrices(prev => ({ ...prev, [bundleId]: numValue }))
    }
  }

  const handleSavePrice = (bundle) => {
    const customPrice = localPrices[bundle._id]
    
    // Validate price is at least base price
    if (customPrice < bundle.basePrice) {
      toast.error(`Price must be at least ${formatCurrency(bundle.basePrice)}`)
      return
    }

    setSavingBundleId(bundle._id)
    savePriceMutation.mutate({
      bundleId: bundle._id,
      customPrice: customPrice
    })
  }

  const totalCommission = bundlesWithPricing.reduce((sum, bundle) => {
    const price = localPrices[bundle._id] ?? bundle.customPrice
    return sum + (price - bundle.basePrice)
  }, 0)

  const avgCommission = bundlesWithPricing.length > 0 ? totalCommission / bundlesWithPricing.length : 0

  const isLoading = isLoadingBundles || isLoadingPricing

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-cyan-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading pricing data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bundle Pricing</h1>
          <p className="text-gray-600 mt-1">Set your selling price for each bundle (must be equal to or above base price)</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bundles</p>
                <p className="text-3xl font-bold mt-1">{bundlesDataSet?.activeCount}</p>
                <p className="text-xs text-gray-500 mt-1">Available for resale</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Commission</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(avgCommission)}</p>
                <p className="text-xs text-gray-500 mt-1">Per bundle sold</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custom Prices</p>
                <p className="text-3xl font-bold mt-1">
                  {bundlesWithPricing.filter(b => b.hasCustomPrice).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Bundles with custom pricing</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-900">How it works</p>
              <p className="text-sm text-blue-700 mt-1">
                Set your selling price for each bundle. Your price must be equal to or above the base price. 
                The difference between your price and the base price is your profit per sale.
              </p>
            </div>
          </div>
        </div>

        {/* Bundle Pricing Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold">Bundle Prices</h2>
              <p className="text-sm text-gray-600 mt-1">
                Adjust prices individually and save each one
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bundle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommend Range</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bundlesWithPricing.map((bundle) => {
                  const currentPrice = localPrices[bundle._id] ?? bundle.customPrice
                  const commission = currentPrice - bundle.basePrice
                  const net = NETWORKS.find((n) => n.id === bundle.network)
                  const isValid = currentPrice >= bundle.basePrice
                  const hasChanged = currentPrice !== bundle.customPrice
                  const isSaving = savingBundleId === bundle._id
                  
                  return (
                    <tr key={bundle._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{bundle.name}</p>
                          <p className="text-xs text-gray-500">{bundle.volume}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${net?.color} flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{net?.name[0]}</span>
                          </div>
                          <span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-700">
                            {net?.name ?? bundle.network.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formatCurrency(bundle.basePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.50"
                          min={bundle.basePrice}
                          value={currentPrice}
                          onChange={(e) => handlePriceChange(bundle._id, e.target.value)}
                          className={`w-28 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none ${
                            !isValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold ${commission > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          +{formatCurrency(commission)}
                        </span>
                      </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="">
                          {bundle.recommendedRange}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleSavePrice(bundle)}
                          disabled={!hasChanged || !isValid || isSaving}
                          className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                            hasChanged && isValid && !isSaving
                              ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isSaving ? (
                            <div className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Saving...
                            </div>
                          ) : (
                            'Save'
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}