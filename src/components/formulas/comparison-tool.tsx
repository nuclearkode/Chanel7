"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftRight, Download, ShieldCheck, FlaskConical } from "lucide-react"
import { usePerfume } from "@/lib/store"

export function ComparisonTool() {
  const { formulas } = usePerfume()

  // Default to first two formulas if available, or empty string
  const [formulaAId, setFormulaAId] = useState<string>(formulas.length > 0 ? formulas[0].id : "")
  const [formulaBId, setFormulaBId] = useState<string>(formulas.length > 1 ? formulas[1].id : (formulas.length > 0 ? formulas[0].id : ""))

  const formulaA = formulas.find(f => f.id === formulaAId)
  const formulaB = formulas.find(f => f.id === formulaBId)

  const diffData = useMemo(() => {
    if (!formulaA && !formulaB) return []

    const ingredientsMap = new Map<string, {
      id: string
      name: string
      cas: string
      weightA: number
      weightB: number
    }>()

    // Process Formula A
    if (formulaA) {
      formulaA.ingredients.forEach(ing => {
        ingredientsMap.set(ing.id, {
          id: ing.id,
          name: ing.name,
          cas: ing.cas,
          weightA: ing.weight,
          weightB: 0
        })
      })
    }

    // Process Formula B
    if (formulaB) {
      formulaB.ingredients.forEach(ing => {
        const existing = ingredientsMap.get(ing.id)
        if (existing) {
          existing.weightB = ing.weight
        } else {
          ingredientsMap.set(ing.id, {
            id: ing.id,
            name: ing.name,
            cas: ing.cas,
            weightA: 0,
            weightB: ing.weight
          })
        }
      })
    }

    return Array.from(ingredientsMap.values()).map(item => ({
      ...item,
      delta: item.weightB - item.weightA,
      status: item.weightA === 0 ? 'added' : (item.weightB === 0 ? 'removed' : (item.weightA !== item.weightB ? 'modified' : 'same'))
    })).sort((a, b) => a.name.localeCompare(b.name))

  }, [formulaA, formulaB])

  const totalWeightA = formulaA ? formulaA.ingredients.reduce((acc, curr) => acc + curr.weight, 0) : 0
  const totalWeightB = formulaB ? formulaB.ingredients.reduce((acc, curr) => acc + curr.weight, 0) : 0
  const totalDelta = totalWeightB - totalWeightA

  // Calculate Similarity (Basic Jaccard-ish index based on shared ingredients presence)
  const similarityIndex = useMemo(() => {
     if (!formulaA || !formulaB) return 0
     const shared = diffData.filter(d => d.weightA > 0 && d.weightB > 0).length
     const totalUnique = diffData.length
     if (totalUnique === 0) return 0
     return (shared / totalUnique) * 100
  }, [diffData, formulaA, formulaB])


  if (formulas.length === 0) {
    return (
      <div className="mt-8 p-8 border border-dashed rounded-xl text-center text-muted-foreground">
        No formulas available for comparison. Create some formulas first.
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full mt-8">
      {/* Left: Control Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <h2 className="text-lg font-semibold font-display text-foreground flex items-center gap-2">
          <ArrowLeftRight className="text-primary w-5 h-5" />
          Comparison Setup
        </h2>
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          {/* Formula A Selection */}
          <div className="mb-6 relative">
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wider">Reference Formula (A)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FlaskConical className="text-primary w-4 h-4" />
              </div>
              <Select value={formulaAId} onValueChange={setFormulaAId}>
                <SelectTrigger className="w-full pl-10 h-10">
                  <SelectValue placeholder="Select Formula A" />
                </SelectTrigger>
                <SelectContent>
                  {formulas.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary" className="font-mono text-[10px]">Total: {totalWeightA.toFixed(2)}g</Badge>
            </div>
          </div>

          {/* Divider with Swap Button */}
          <div className="relative flex items-center justify-center mb-6">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="relative rounded-full h-8 w-8 bg-card border-border hover:border-primary text-muted-foreground hover:text-primary z-10"
                onClick={() => {
                    const temp = formulaAId
                    setFormulaAId(formulaBId)
                    setFormulaBId(temp)
                }}
            >
              <ArrowLeftRight className="w-4 h-4 rotate-90" />
            </Button>
          </div>

          {/* Formula B Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wider">Target Formula (B)</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FlaskConical className="text-purple-400 w-4 h-4" />
              </div>
               <Select value={formulaBId} onValueChange={setFormulaBId}>
                <SelectTrigger className="w-full pl-10 h-10">
                  <SelectValue placeholder="Select Formula B" />
                </SelectTrigger>
                <SelectContent>
                   {formulas.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary" className="font-mono text-[10px]">Total: {totalWeightB.toFixed(2)}g</Badge>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-3 border border-border">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Similarity Index</span>
              <span className="font-mono font-bold text-primary">{similarityIndex.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${similarityIndex}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-border/50">
              <span className="text-muted-foreground">Weight Delta</span>
              <span className={cn("font-mono font-bold text-xs", totalDelta > 0 ? "text-emerald-500" : (totalDelta < 0 ? "text-destructive" : "text-muted-foreground"))}>
                {totalDelta > 0 ? '+' : ''}{totalDelta.toFixed(2)}g
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Diff Table */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold font-display text-foreground flex items-center gap-2">
            <span className="material-icons text-primary text-base">difference</span>
            Ingredient Analysis
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Download className="w-3 h-3" /> Export CSV
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-primary bg-primary/10 hover:bg-primary/20">
              <ShieldCheck className="w-3 h-3" /> IFRA Check
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto flex-1">
            <Table>
              <TableHeader className="bg-secondary/50 sticky top-0 z-20">
                <TableRow>
                  <TableHead className="w-[200px] sticky left-0 bg-secondary/50 z-20">Ingredient Name</TableHead>
                  <TableHead>CAS #</TableHead>
                  <TableHead className="text-right">Qty A (g)</TableHead>
                  <TableHead className="text-right">Qty B (g)</TableHead>
                  <TableHead className="text-right">Delta</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm font-mono">
                {diffData.map((item) => (
                    <TableRow key={item.id} className={cn("transition-colors group",
                        item.status === 'added' ? "bg-emerald-500/5 hover:bg-emerald-500/10" :
                        item.status === 'removed' ? "bg-destructive/5 hover:bg-destructive/10" :
                        "hover:bg-muted/30"
                    )}>
                    <TableCell className={cn("font-medium sticky left-0 z-10 border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors",
                         item.status === 'added' ? "bg-background group-hover:bg-emerald-500/10" :
                         item.status === 'removed' ? "bg-background group-hover:bg-destructive/10" :
                         "bg-card group-hover:bg-muted/30"
                    )}>
                        <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full",
                            item.status === 'added' ? "bg-emerald-500" :
                            item.status === 'removed' ? "bg-destructive" :
                            item.status === 'modified' ? "bg-yellow-500" : "bg-muted-foreground"
                        )}></div>
                        <span className="font-display truncate max-w-[150px]" title={item.name}>{item.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{item.cas}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.weightA > 0 ? item.weightA.toFixed(2) : '-'}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{item.weightB > 0 ? item.weightB.toFixed(2) : '-'}</TableCell>
                    <TableCell className={cn("text-right font-bold",
                        item.delta > 0 ? "text-emerald-500" : (item.delta < 0 ? "text-destructive" : "text-muted-foreground")
                    )}>
                        {item.delta > 0 ? '+' : ''}{item.delta !== 0 ? item.delta.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell className="text-center">
                        {item.status === 'added' && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Added</Badge>}
                        {item.status === 'removed' && <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Removed</Badge>}
                        {item.status === 'modified' && <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px]">Modified</Badge>}
                        {item.status === 'same' && <Badge variant="secondary" className="text-[10px]">Same</Badge>}
                    </TableCell>
                    </TableRow>
                ))}
              </TableBody>
              <tfoot className="bg-muted/80 border-t border-border sticky bottom-0 z-20 font-mono text-sm">
                <TableRow>
                    <TableCell className="font-bold sticky left-0 bg-muted/80 border-r border-border">Totals</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-bold">{totalWeightA.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold">{totalWeightB.toFixed(2)}</TableCell>
                    <TableCell className={cn("text-right font-bold", totalDelta > 0 ? "text-emerald-500" : (totalDelta < 0 ? "text-destructive" : "text-muted-foreground"))}>
                         {totalDelta > 0 ? '+' : ''}{totalDelta.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground italic">Diff</TableCell>
                </TableRow>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
