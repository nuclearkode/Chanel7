"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { UserCircle, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

const menuItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/encyclopedia", label: "Encyclopedia" },
  { href: "/lab", label: "The Lab" },
  { href: "/inventory", label: "Inventory" },
  { href: "/analysis", label: "Analysis" },
  { href: "/formulas", label: "Formulas" },
  { href: "/creation", label: "AI Tools" },
]

export function AppHeader() {
  const pathname = usePathname()

  if (pathname.startsWith('/collaboration')) {
    return null
  }

  return (
    <nav className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-2 w-64">
        <div className="bg-primary h-8 w-8 rounded flex items-center justify-center text-primary-foreground font-bold text-lg">P</div>
        <span className="font-bold text-lg tracking-tight font-display">PerFume</span>
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="flex space-x-1 bg-secondary/50 p-1 rounded-lg overflow-x-auto max-w-full">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                pathname.startsWith(item.href)
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-primary hover:bg-background/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 w-64 justify-end">
        <ModeToggle />
        <button className="text-muted-foreground hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="sr-only">Notifications</span>
        </button>
        <Avatar className="h-8 w-8 border border-border">
             {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
            <AvatarFallback>
              <UserCircle className="w-5 h-5" />
            </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}
