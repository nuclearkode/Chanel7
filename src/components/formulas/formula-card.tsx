"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Formula } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface FormulaCardProps {
  formula: Formula
  onClick?: () => void
}

export function FormulaCard({ formula, onClick }: FormulaCardProps) {
    const ingredientCount = formula.items ? formula.items.length : (formula.ingredients ? formula.ingredients.length : 0)
    const stars = 4 // Mock
    const type = "Chypre" // Mock type derivation or just static for now
    const color = "bg-primary/10 text-primary border-primary/20"
    const lastEdited = formula.updatedAt ? formatDistanceToNow(new Date(formula.updatedAt), { addSuffix: true }) : "Unknown"

  return (
    <div onClick={onClick} className="h-full">
        <Card className="hover:border-primary/50 transition-all duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col p-4 bg-card border-border">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="flex justify-between items-start mb-3">
            <Badge variant="secondary" className={cn("text-xs font-bold uppercase tracking-wider", color)}>
            {type}
            </Badge>
            <div className="flex gap-0.5 text-amber-500">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-3 h-3 fill-current", i >= stars && "text-muted-foreground fill-none")} />
            ))}
            </div>
        </div>

        <h3 className="text-lg font-bold font-display text-foreground mb-1 group-hover:text-primary transition-colors">
            {formula.name}
        </h3>
        <p className="text-muted-foreground text-xs mb-4">Last edited: {lastEdited}</p>

        <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
            <div className="text-xs text-muted-foreground font-mono">
            <span className="text-foreground font-bold">{ingredientCount}</span> Ingredients
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
        </Card>
    </div>
  )
}
