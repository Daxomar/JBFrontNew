

import { Suspense } from "react"

export default function BundlePurchaseLayout({ children }) {
  return (
    <div className="">
       <Suspense fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  )
}