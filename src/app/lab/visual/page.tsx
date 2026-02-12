"use client"

import React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { VisualEditor } from "@/components/visual-lab/visual-editor"
import { PerfumeProvider } from "@/lib/store"

export default function VisualLabPage() {
  return (
    <PerfumeProvider>
        <SidebarProvider>
          <div className="relative flex h-screen w-full bg-zinc-950 text-slate-200 overflow-hidden">
            <AppSidebar />
            <SidebarInset className="flex-1 flex flex-col h-full bg-zinc-950 p-0 overflow-hidden">
               {/* Custom Header matching design reference could go here if needed, or VisualEditor handles it */}
               <VisualEditor />
            </SidebarInset>
          </div>
        </SidebarProvider>
    </PerfumeProvider>
  )
}
