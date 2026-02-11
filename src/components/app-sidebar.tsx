"use client"

import * as React from "react"
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
  Settings,
  UserCircle,
  Wand2,
  Activity,
  FileText
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Separator } from "./ui/separator"

const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lab", label: "The Lab", icon: FlaskConical },
  { href: "/inventory", label: "Inventory", icon: Library },
  { href: "/analysis", label: "Analysis", icon: Activity },
  { href: "/formulas", label: "Formulas", icon: FileText },
  { href: "/creation", label: "AI Tools", icon: Wand2 },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-cyan-300 flex items-center justify-center text-primary-foreground font-bold text-xl">P</div>
          <h1 className="text-xl font-bold font-display tracking-tight">PerFume</h1>
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

        <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent border border-sidebar-border/50">
          <Avatar className="h-9 w-9 border border-primary/20">
             {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
            <AvatarFallback>
              <UserCircle />
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-medium truncate text-sm">Dr. A. Elara</p>
            <p className="text-xs text-muted-foreground truncate">
              Chief Nose
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
