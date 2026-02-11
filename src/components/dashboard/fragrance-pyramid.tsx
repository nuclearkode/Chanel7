"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function FragrancePyramid() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-xl font-bold font-display text-foreground">Fragrance Architecture</h2>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <span className="material-icons">info</span>
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-8 relative z-10">
        Visualizing the olfactory structure of the currently selected formula.
      </p>

      {/* The Pyramid Visualization */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 space-y-2">
        {/* Top Note */}
        <div className="w-24 text-center group cursor-default relative">
          <div className="h-20 w-0 border-l-[48px] border-r-[48px] border-b-[80px] border-l-transparent border-r-transparent border-b-sky-300 mx-auto opacity-90 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(125,211,252,0.5)]"></div>
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 top-full bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap border border-border shadow-lg z-50">
            Top: Citrus, Light, Volatile
          </div>
        </div>

        {/* Heart Note */}
        <div className="w-40 text-center -mt-3 group cursor-default relative">
          <div
            className="h-24 w-[160px] bg-gradient-to-b from-sky-400 to-sky-500 mx-auto opacity-90 group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            style={{ clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0% 100%)" }}
          ></div>
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 top-full bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap border border-border shadow-lg z-50">
            Heart: Floral, Spice, Core
          </div>
        </div>

        {/* Base Note */}
        <div className="w-56 text-center -mt-1 group cursor-default relative">
          <div
            className="h-28 w-full bg-gradient-to-b from-sky-600 to-sky-700 mx-auto opacity-90 group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(3,105,161,0.3)]"
            style={{ clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0% 100%)" }}
          ></div>
          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute left-1/2 -translate-x-1/2 top-full bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap border border-border shadow-lg z-50">
            Base: Wood, Musk, Fixative
          </div>
        </div>
      </div>

      {/* Legend/Key */}
      <div className="mt-8 space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-300"></span>
            <span className="text-foreground">Top Notes</span>
          </div>
          <span className="text-muted-foreground">15% (Target: 15-25%)</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500"></span>
            <span className="text-foreground">Heart Notes</span>
          </div>
          <span className="text-muted-foreground">30% (Target: 30-40%)</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-700"></span>
            <span className="text-foreground">Base Notes</span>
          </div>
          <span className="text-muted-foreground">55% (Target: 45-55%)</span>
        </div>
      </div>

      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  )
}
