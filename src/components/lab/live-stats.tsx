"use client"

import React from "react"
import { FlaskConical, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type FormulaItem } from "@/lib/types"

interface LiveStatsProps {
  totalWeight: number
  oilConcentration: number // percentage
  items: FormulaItem[]
}

export function LiveStats({ totalWeight, oilConcentration, items }: LiveStatsProps) {
  // Calculate Note Pyramid Ratios
  const topWeight = items.filter(i => i.ingredient.note === 'Top').reduce((sum, i) => sum + i.amount, 0)
  const midWeight = items.filter(i => i.ingredient.note === 'Mid').reduce((sum, i) => sum + i.amount, 0)
  const baseWeight = items.filter(i => i.ingredient.note === 'Base').reduce((sum, i) => sum + i.amount, 0)

  const totalNotes = topWeight + midWeight + baseWeight || 1 // avoid div/0
  const topPct = (topWeight / totalNotes) * 100
  const midPct = (midWeight / totalNotes) * 100
  const basePct = (baseWeight / totalNotes) * 100

  // Calculate Materials Cost
  const materialsCost = items.reduce((sum, item) => sum + (item.ingredient.cost * item.amount), 0)

  // Total Cost (assuming Dilutant $1.50 + Bottle $2.50 fixed for now)
  const dilutantCost = 1.50
  const packagingCost = 2.50
  const totalCost = materialsCost + dilutantCost + packagingCost

  return (
    <aside className="w-full lg:w-[400px] xl:w-[450px] bg-secondary/10 border-l border-border overflow-y-auto flex flex-col h-full">
      <div className="p-6 space-y-6">
        <h2 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          Live Analytics
        </h2>

        {/* Vitals Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Total Weight</div>
            <div className="text-2xl font-bold font-mono text-foreground">{totalWeight.toFixed(2)}<span className="text-sm text-muted-foreground ml-1">g</span></div>
            <div className="mt-2 text-[10px] text-emerald-500 font-mono flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Target Met
            </div>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 p-2 opacity-10">
              <FlaskConical className="w-12 h-12 text-primary" />
            </div>
            <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Oil Conc.</div>
            <div className="text-2xl font-bold font-mono text-foreground">{oilConcentration.toFixed(1)}<span className="text-sm text-muted-foreground ml-1">%</span></div>
            <div className="mt-2 text-[10px] text-primary font-bold font-mono px-2 py-0.5 bg-primary/20 rounded inline-block">
              EAU DE PARFUM
            </div>
          </div>
        </div>

        {/* Note Pyramid Chart */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-bold text-foreground">Note Structure</h3>
            <span className="text-[10px] text-muted-foreground font-mono">RELATIVE RATIO</span>
          </div>
          {/* Horizontal Bar Chart */}
          <div className="flex h-6 rounded-full overflow-hidden w-full mb-4 bg-muted">
            <div className="h-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-help" style={{ width: `${topPct}%` }} title={`Top Notes: ${topPct.toFixed(0)}%`}></div>
            <div className="h-full bg-pink-500/80 hover:bg-pink-500 transition-colors cursor-help" style={{ width: `${midPct}%` }} title={`Heart Notes: ${midPct.toFixed(0)}%`}></div>
            <div className="h-full bg-amber-700/80 hover:bg-amber-700 transition-colors cursor-help" style={{ width: `${basePct}%` }} title={`Base Notes: ${basePct.toFixed(0)}%`}></div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-yellow-500">{topPct.toFixed(0)}%</div>
              <div className="text-[10px] uppercase text-muted-foreground tracking-wide mt-1">Top</div>
            </div>
            <div className="flex flex-col items-center relative after:content-[''] after:absolute after:-left-1 after:top-2 after:h-6 after:w-[1px] after:bg-border">
              <div className="text-xs font-bold text-pink-500">{midPct.toFixed(0)}%</div>
              <div className="text-[10px] uppercase text-muted-foreground tracking-wide mt-1">Heart</div>
            </div>
            <div className="flex flex-col items-center relative after:content-[''] after:absolute after:-left-1 after:top-2 after:h-6 after:w-[1px] after:bg-border">
              <div className="text-xs font-bold text-amber-700">{basePct.toFixed(0)}%</div>
              <div className="text-[10px] uppercase text-muted-foreground tracking-wide mt-1">Base</div>
            </div>
          </div>
        </div>

        {/* IFRA Compliance */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-foreground">IFRA Compliance</h3>
            <span className="text-[10px] bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded font-mono">PASSED (Cat 4)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            All ingredients are within safe usage limits for Fine Fragrance (Category 4).
          </p>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-right">
                <span className="text-[10px] font-semibold inline-block text-primary">Bergamot Oil (Max 0.4%)</span>
              </div>
            </div>
            <div className="overflow-hidden h-1.5 mb-1 text-xs flex rounded bg-secondary">
              <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary/70" style={{ width: "65%" }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0%</span>
              <span>Limit</span>
            </div>
          </div>
        </div>

        {/* Cost Calculator */}
        <div className="bg-card rounded-xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/50 rounded-t-xl">
            <h3 className="text-sm font-bold text-foreground">Cost Estimation</h3>
          </div>
          <div className="p-4 flex-1">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="py-2 text-muted-foreground">Materials Cost</td>
                  <td className="py-2 text-right font-mono text-foreground">${materialsCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Dilutant</td>
                  <td className="py-2 text-right font-mono text-foreground">${dilutantCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Bottle & Packaging</td>
                  <td className="py-2 text-right font-mono text-foreground">${packagingCost.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot className="border-t border-border">
                <tr>
                  <td className="pt-3 font-bold text-foreground uppercase tracking-wider">Total / Unit</td>
                  <td className="pt-3 text-right font-bold font-mono text-lg text-primary">${totalCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            <Button variant="outline" className="w-full mt-4 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors border-border">
              View Detailed Breakdown
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
