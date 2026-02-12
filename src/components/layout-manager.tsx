"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { TacticalAISidebar } from "@/components/tactical-ai-sidebar"

export function LayoutManager({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCollaboration = pathname?.startsWith('/collaboration')

  if (isCollaboration) {
    return <>{children}</>
  }

  return (
    <>
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <TacticalAISidebar />
        <main className="flex-1 overflow-hidden relative flex flex-col bg-background">
          {children}
        </main>
      </div>
    </>
  )
}
