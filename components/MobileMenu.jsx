"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileMenu({ items, triggerClassName }) {
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === "/" || href === "/admin" || href === "/reseller") {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] max-w-[85vw] p-0 bg-white border-l border-slate-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 p-0.5">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold text-slate-900">JoyBundle</span>
            </div>
            <SheetClose className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </SheetClose>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 overflow-y-auto">
            <div className="flex flex-col gap-1">
              {items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      item.variant === "danger" && "text-red-600 hover:bg-red-50 hover:text-red-700"
                    )}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
