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
    case "Floral": return "bg-pink-100 text-pink-700 border-pink-200"
    case "Woody": return "bg-stone-100 text-stone-700 border-stone-200"
    case "Citrus": return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "Fruity": return "bg-orange-100 text-orange-700 border-orange-200"
    case "Spicy": return "bg-red-100 text-red-700 border-red-200"
    case "Green": return "bg-green-100 text-green-700 border-green-200"
    case "Gourmand": return "bg-purple-100 text-purple-700 border-purple-200"
    case "Aquatic": return "bg-cyan-100 text-cyan-700 border-cyan-200"
    case "Amber": return "bg-amber-100 text-amber-700 border-amber-200"
    case "Musky": return "bg-slate-100 text-slate-700 border-slate-200"
    case "Animalic": return "bg-rose-100 text-rose-800 border-rose-200"
    case "Earthy": return "bg-emerald-100 text-emerald-700 border-emerald-200"
    default: return "bg-gray-100 text-gray-700 border-gray-200"
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
