"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  FlaskConical,
  Library,
  Trophy,
  Settings,
  UserCircle,
  FileCheck2,
  Wand2,
  ShoppingCart,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Separator } from "./ui/separator"

const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/formulas", label: "Formulas", icon: FlaskConical },
  { href: "/inventory", label: "Inventory", icon: Library },
  { href: "/creation", label: "Creation", icon: Wand2 },
  { href: "/sourcing", label: "Sourcing", icon: ShoppingCart },
  { href: "/compliance", label: "Compliance", icon: FileCheck2 },
  { href: "/training", label: "Training", icon: Trophy },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-semibold font-headline">ScentForge</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <Separator className="bg-sidebar-border" />
        <SidebarMenu>
          <SidebarMenuItem>
             <Link href="/settings" legacyBehavior passHref>
                <SidebarMenuButton tooltip="Settings" isActive={pathname.startsWith('/settings')}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent">
          <Avatar className="h-9 w-9">
             {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
            <AvatarFallback>
              <UserCircle />
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-medium truncate">Jane Doe</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">
              Artisan Perfumer
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
