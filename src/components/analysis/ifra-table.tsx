"use client"

import React, { useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Ban, ShieldCheck, Info } from "lucide-react"
import { type FormulaItem } from "@/lib/types"

interface IFRAComplianceTableProps {
    items: FormulaItem[]
}

export function IFRAComplianceTable({ items }: IFRAComplianceTableProps) {
  const { analysis, stats } = useMemo(() => {
    const totalWeight = items.reduce((sum, i) => sum + i.amount, 0) || 1

    const results = items.map(item => {
        const percentage = (item.amount / totalWeight) * 100
        const limit = item.ingredient.ifraLimit
        // Mock checking logic
        // If limit is 100, we consider it "No Restriction" effectively for this demo, unless specifically flagged

        let status: "PASS" | "WARNING" | "VIOLATION" = "PASS"
        if (limit < 100) {
            if (percentage > limit) status = "VIOLATION"
            else if (percentage > limit * 0.8) status = "WARNING"
        }

        return {
            item,
            percentage,
            limit,
            status
        }
    }).filter(r => r.limit < 100) // Only show restricted items in the main list for clarity, or show all?
    // Let's show restricted ones prominently.

    const stats = {
        violation: results.filter(r => r.status === "VIOLATION").length,
        warning: results.filter(r => r.status === "WARNING").length,
        safe: results.filter(r => r.status === "PASS").length,
        total: items.length
    }

    // Sort: Violations first
    results.sort((a, b) => {
        const score = { "VIOLATION": 3, "WARNING": 2, "PASS": 1 }
        return score[b.status] - score[a.status]
    })

    return { analysis: results, stats }
  }, [items])

  return (
    <div className="bg-card/90 backdrop-blur-sm border-t-4 border-t-destructive rounded-xl overflow-hidden mt-6 shadow-sm">
      <div className="p-6 border-b border-border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-display text-foreground">IFRA Compliance Analysis</h2>
            {stats.violation > 0 ? (
                <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> VIOLATION DETECTED
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> COMPLIANT
                </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Analysis based on Amendment 51 Standards</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/50 p-1 rounded-lg border border-border">
          <label className="text-xs text-muted-foreground pl-3 font-medium">Category:</label>
          <Select defaultValue="cat4">
            <SelectTrigger className="w-[180px] bg-transparent border-none h-8 focus:ring-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cat4">Cat 4 - Fine Fragrance</SelectItem>
              <SelectItem value="cat5a">Cat 5A - Body Lotion</SelectItem>
              <SelectItem value="cat1">Cat 1 - Lip Products</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border bg-muted/30">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{stats.violation}</div>
            <div className="text-xs text-muted-foreground">Prohibited/Exceeded</div>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{stats.warning}</div>
            <div className="text-xs text-muted-foreground">Restricted (Near Limit)</div>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{stats.safe}</div>
            <div className="text-xs text-muted-foreground">Restricted (Safe)</div>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-display">{stats.total - analysis.length}</div>
            <div className="text-xs text-muted-foreground">No Restrictions</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
            <TableRow>
              <TableHead className="px-6 py-4">Restricted Material</TableHead>
              <TableHead className="px-6 py-4">CAS Number</TableHead>
              <TableHead className="px-6 py-4">Restriction Type</TableHead>
              <TableHead className="px-6 py-4 text-right">Current Usage</TableHead>
              <TableHead className="px-6 py-4 text-right">Allowed Limit</TableHead>
              <TableHead className="px-6 py-4 text-center">Status</TableHead>
              <TableHead className="px-6 py-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {analysis.length > 0 ? analysis.map(({ item, percentage, limit, status }) => (
                <TableRow key={item.ingredient.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.ingredient.name}</div>
                        {item.ingredient.isAllergen && <div className="text-xs text-muted-foreground mt-0.5">Allergen</div>}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground font-mono text-xs">{item.ingredient.casNumber}</TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">Quantitative Limit</TableCell>
                    <TableCell className={cn("px-6 py-4 text-right font-medium",
                        status === "VIOLATION" ? "text-destructive font-bold" :
                        status === "WARNING" ? "text-orange-500" : "text-foreground"
                    )}>
                        {percentage.toFixed(2)}%
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-muted-foreground">{limit.toFixed(2)}%</TableCell>
                    <TableCell className="px-6 py-4 text-center">
                        {status === "VIOLATION" && <Badge variant="destructive">VIOLATION</Badge>}
                        {status === "WARNING" && <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">WARNING</Badge>}
                        {status === "PASS" && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">PASS</Badge>}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                        {status === "VIOLATION" && <Button variant="link" className="text-primary h-auto p-0">Auto-Fix</Button>}
                    </TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No restricted materials found in this formula.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-border bg-muted/30 text-center">
        <Button variant="link" className="text-primary font-medium mx-auto">
          View Full Compliance Report
        </Button>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
