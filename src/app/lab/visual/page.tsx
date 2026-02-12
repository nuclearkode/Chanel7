"use client"

import React from "react"
import { VisualEditor } from "@/components/visual-lab/visual-editor"
import { PerfumeProvider } from "@/lib/store"

export default function VisualLabPage() {
  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 p-0 overflow-hidden">
       {/* Custom Header matching design reference could go here if needed, or VisualEditor handles it */}
       <VisualEditor />
    </div>
  )
}
