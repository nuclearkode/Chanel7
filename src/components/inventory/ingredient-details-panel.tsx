"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { type Ingredient } from "@/lib/types"
import { FlaskConical, Tag, Share2, ShieldCheck, Zap } from "lucide-react"

interface IngredientDetailsPanelProps {
  ingredient: Ingredient | null
  onAdd?: () => void
}

export function IngredientDetailsPanel({ ingredient, onAdd }: IngredientDetailsPanelProps) {
  if (!ingredient) {
    return (
      <div className="hidden lg:flex w-[400px] h-full flex-col items-center justify-center p-8 text-center bg-card border-l border-border">
        <FlaskConical className="w-16 h-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-bold text-muted-foreground">Select a Material</h3>
        <p className="text-sm text-muted-foreground/70 mt-2">Click on an ingredient card to view its detailed profile and properties.</p>
      </div>
    )
  }

  return (
    <aside className="w-[400px] bg-card border-l border-border flex flex-col shadow-2xl z-20 hidden lg:flex h-full">
      {/* Header Image */}
      <div className="h-40 relative group w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
        {/* Placeholder Gradient/Image */}
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary opacity-60 group-hover:scale-105 transition-transform duration-700"></div>
        <div className="absolute bottom-4 left-6 z-20">
          <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 block">Selected Material</span>
          <h2 className="text-3xl font-bold text-foreground leading-none">{ingredient.name}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary/50 rounded border border-border">
            <span className="text-xs text-muted-foreground block mb-1">Supplier</span>
            <span className="text-sm font-medium text-foreground">{ingredient.vendor}</span>
          </div>
          <div className="p-3 bg-secondary/50 rounded border border-border">
            <span className="text-xs text-muted-foreground block mb-1">Cost / kg</span>
            <span className="text-sm font-medium text-foreground">${(ingredient.cost * 1000).toFixed(2)}</span>
          </div>
        </div>

        {/* Performance Bars */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
            <Zap className="text-primary w-4 h-4" /> Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Impact (Odor Strength)</span>
                <span className="text-primary font-bold">High</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Longevity (on blotter)</span>
                <span className="text-foreground font-bold">24 Hours</span>
              </div>
              <Progress value={30} className="h-2 bg-secondary" />
            </div>
          </div>
        </div>

        {/* Descriptors Tags */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Tag className="text-primary w-4 h-4" /> Olfactory Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredient.olfactiveFamilies.map(fam => (
              <Badge key={fam} variant="secondary" className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground border border-border">
                {fam}
              </Badge>
            ))}
            {/* Mock Tags */}
            <Badge variant="secondary" className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground border border-border">Fresh</Badge>
            <Badge variant="secondary" className="px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground border border-border">Zesty</Badge>
          </div>
        </div>

        {/* IFRA Compliance */}
        <div className="p-4 rounded bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-emerald-500 w-5 h-5 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-400">IFRA Compliant</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                No restrictions for Category 4 (Fine Fragrance). Contains Limonene and Linalool (declare as allergens).
              </p>
            </div>
          </div>
        </div>

        {/* Similar Materials */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Share2 className="text-primary w-4 h-4" /> Similar Materials
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 rounded hover:bg-secondary/50 cursor-pointer transition-colors group/item border border-transparent hover:border-border">
              <div>
                <div className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">Bergamot Oil Ivory Coast</div>
                <div className="text-xs text-muted-foreground">Natural</div>
              </div>
              <Badge variant="outline" className="text-xs font-bold text-primary bg-primary/10 border-primary/20 px-2 py-1 rounded">92% Match</Badge>
            </div>
            <div className="flex items-center justify-between p-2 rounded hover:bg-secondary/50 cursor-pointer transition-colors group/item border border-transparent hover:border-border">
              <div>
                <div className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">Linalyl Acetate</div>
                <div className="text-xs text-muted-foreground">Synthetic</div>
              </div>
              <Badge variant="outline" className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded">76% Match</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border bg-card mt-auto shrink-0">
        <Button onClick={onAdd} className="w-full font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 py-6">
          <FlaskConical className="w-5 h-5" />
          Add to Formula
        </Button>
      </div>
    </aside>
  )
}
