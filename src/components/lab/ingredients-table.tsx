"use client"

import React from "react"
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
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { type FormulaItem } from "@/lib/types"

interface IngredientsTableProps {
  items: FormulaItem[]
  onUpdateQuantity: (id: string, amount: number) => void
  onRemove: (id: string) => void
  totalWeight: number
}

const getFamilyColor = (family: string) => {
  switch (family) {
    case "Woody": return "bg-amber-900/30 text-amber-500 border-amber-900/50"
    case "Floral": return "bg-pink-900/30 text-pink-400 border-pink-900/50"
    case "Citrus": return "bg-yellow-900/30 text-yellow-500 border-yellow-900/50"
    case "Amber": return "bg-amber-900/30 text-amber-500 border-amber-900/50"
    default: return "bg-slate-900/30 text-slate-400 border-slate-700"
  }
}

export function IngredientsTable({ items, onUpdateQuantity, onRemove, totalWeight }: IngredientsTableProps) {
  // We removed local state for adding ingredients as that should be handled by a global search or the inventory page
  // For now, we just display the list and allow edits

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50 text-xs uppercase font-semibold">
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Material Name</TableHead>
            <TableHead className="w-32">Family</TableHead>
            <TableHead className="w-28 text-right">Qty (g)</TableHead>
            <TableHead className="w-24 text-right">Conc %</TableHead>
            <TableHead className="w-16 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm">
          {items.map((item, index) => {
            const percentage = totalWeight > 0 ? (item.amount / totalWeight) * 100 : 0
            const ingredient = item.ingredient
            return (
              <TableRow key={ingredient.id} className="group hover:bg-muted/50 transition-colors">
                <TableCell className="text-center text-muted-foreground font-mono">{String(index + 1).padStart(2, '0')}</TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{ingredient.name}</div>
                  <div className="text-xs text-muted-foreground">{ingredient.vendor} • 100% Strength</div>
                </TableCell>
                <TableCell>
                  {ingredient.olfactiveFamilies.slice(0, 1).map(family => (
                    <Badge key={family} variant="outline" className={`rounded text-[10px] uppercase font-bold border ${getFamilyColor(family)}`}>
                      {family}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell className="text-right font-mono">
                  <Input
                    className="w-full text-right h-8 bg-transparent border-transparent hover:border-input focus:border-primary px-1"
                    value={item.amount}
                    onChange={(e) => onUpdateQuantity(ingredient.id, parseFloat(e.target.value) || 0)}
                    type="number"
                    step="0.01"
                  />
                </TableCell>
                <TableCell className="text-right font-mono text-primary">{percentage.toFixed(1)}%</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity h-8 w-8" onClick={() => onRemove(ingredient.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
          {items.length === 0 && (
             <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No ingredients in formula. Go to Inventory to add some.
                </TableCell>
             </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
