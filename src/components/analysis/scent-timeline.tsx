"use client"

import React, { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"
import { type FormulaItem } from "@/lib/types"

interface ScentTimelineProps {
  items: FormulaItem[]
}

export function ScentTimeline({ items }: ScentTimelineProps) {
  const data = useMemo(() => {
    // Simplified simulation:
    // Top notes fade quickly (0-1h)
    // Mid notes fade moderately (1-4h)
    // Base notes fade slowly (4-8h+)

    // Calculate total weight for each note category
    let topTotal = 0
    let midTotal = 0
    let baseTotal = 0

    items.forEach(item => {
      if (item.ingredient.note === 'Top') topTotal += item.amount
      if (item.ingredient.note === 'Mid') midTotal += item.amount
      if (item.ingredient.note === 'Base') baseTotal += item.amount
    })

    // Normalize to 0-100 scale for relative intensity
    const total = topTotal + midTotal + baseTotal || 1
    const top = (topTotal / total) * 100
    const mid = (midTotal / total) * 100
    const base = (baseTotal / total) * 100

    return [
      { time: "0m", top: top, heart: mid, base: base },
      { time: "15m", top: top * 0.8, heart: mid * 1.05, base: base * 1.01 },
      { time: "30m", top: top * 0.5, heart: mid * 1.1, base: base * 1.02 },
      { time: "1h", top: top * 0.2, heart: mid * 1.0, base: base * 1.03 },
      { time: "2h", top: top * 0.05, heart: mid * 0.8, base: base * 1.04 },
      { time: "4h", top: 0, heart: mid * 0.4, base: base * 1.0 },
      { time: "8h", top: 0, heart: mid * 0.1, base: base * 0.9 },
    ]
  }, [items])

  return (
    <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
            <span className="text-primary material-icons">schedule</span>
            Scent Timeline
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Predicted evaporation curve & note distribution</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded text-xs text-foreground">
            <span className="w-2 h-2 rounded-full bg-cyan-300"></span> Top
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded text-xs text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Heart
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded text-xs text-foreground">
            <span className="w-2 h-2 rounded-full bg-blue-900"></span> Base
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#67e8f9" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "0.5rem" }}
              itemStyle={{ color: "hsl(var(--popover-foreground))", fontSize: "12px" }}
            />
            <Area type="monotone" dataKey="top" stackId="1" stroke="#67e8f9" fillOpacity={1} fill="url(#colorTop)" />
            <Area type="monotone" dataKey="heart" stackId="1" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHeart)" />
            <Area type="monotone" dataKey="base" stackId="1" stroke="#1e3a8a" fillOpacity={1} fill="url(#colorBase)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-secondary/30 p-3 rounded-lg border border-border">
          <div className="text-xs text-muted-foreground mb-1">Tenacity</div>
          <div className="text-xl font-bold font-display text-foreground">Long Lasting</div>
          <div className="text-xs text-primary mt-1 font-mono">~8.5 Hours</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded-lg border border-border">
          <div className="text-xs text-muted-foreground mb-1">Projection</div>
          <div className="text-xl font-bold font-display text-foreground">Moderate</div>
          <div className="text-xs text-primary mt-1 font-mono">~2 Meters</div>
        </div>
        <div className="bg-secondary/30 p-3 rounded-lg border border-border">
          <div className="text-xs text-muted-foreground mb-1">Impact</div>
          <div className="text-xl font-bold font-display text-foreground">High</div>
          <div className="w-full bg-secondary h-1 rounded-full mt-2">
            <div className="bg-primary h-1 rounded-full w-[75%]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
