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
      <div className="h-64 relative group w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10"></div>
        {ingredient.imageUrl ? (
          <img
            src={ingredient.imageUrl}
            alt={ingredient.name}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary opacity-60 group-hover:scale-105 transition-transform duration-700"></div>
        )}
        <div className="absolute bottom-6 left-6 z-20 right-6">
          <div className="flex gap-2 mb-2">
            <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20 backdrop-blur-md">
              {ingredient.note} Note
            </Badge>
             {ingredient.ifraLimit < 100 && (
                <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/30 backdrop-blur-md">
                    Restricted
                </Badge>
             )}
          </div>
          <h2 className="text-3xl font-black text-foreground leading-none tracking-tight drop-shadow-md mb-2">{ingredient.name}</h2>
          <p className="text-sm text-muted-foreground font-medium line-clamp-2 drop-shadow-sm text-shadow">
            {ingredient.description}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-background">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
            <span className="text-xs text-muted-foreground block mb-1 uppercase tracking-wider font-semibold">Supplier</span>
            <span className="text-sm font-medium text-foreground">{ingredient.vendor}</span>
          </div>
          <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
            <span className="text-xs text-muted-foreground block mb-1 uppercase tracking-wider font-semibold">Cost / kg</span>
            <span className="text-sm font-medium text-foreground">${(ingredient.cost * 1000).toFixed(2)}</span>
          </div>
        </div>

        {/* Performance Bars */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
            <Zap className="text-primary w-4 h-4" /> Performance
          </h3>
          <div className="space-y-4 p-4 bg-secondary/10 rounded-xl border border-border/50">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground font-medium">Impact (Strength)</span>
                <span className="text-primary font-bold">{ingredient.impact}/100</span>
              </div>
              <Progress value={ingredient.impact} className="h-2 bg-secondary" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground font-medium">Longevity (Hours)</span>
                <span className="text-foreground font-bold">{ingredient.longevity}h</span>
              </div>
              <Progress value={Math.min((ingredient.longevity / 400) * 100, 100)} className="h-2 bg-secondary" />
            </div>
          </div>
        </div>

        {/* Descriptors Tags */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Tag className="text-primary w-4 h-4" /> Olfactory Profile
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredient.olfactiveFamilies.map(fam => (
              <Badge key={fam} variant="secondary" className="px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border/50 hover:bg-secondary/80 transition-colors">
                {fam}
              </Badge>
            ))}
          </div>
        </div>

        {/* IFRA Compliance */}
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-emerald-500 w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-400">IFRA Status</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {ingredient.ifraLimit >= 100
                    ? "No restrictions for Category 4 (Fine Fragrance)."
                    : `Restricted to ${ingredient.ifraLimit}% in the final product for Category 4.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border bg-card mt-auto shrink-0 backdrop-blur-xl bg-background/80 supports-[backdrop-filter]:bg-background/60">
        <Button onClick={onAdd} className="w-full font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 py-6 text-base hover:scale-[1.02] transition-transform active:scale-[0.98]">
          <FlaskConical className="w-5 h-5" />
          Add to Formula
        </Button>
      </div>
    </aside>
  )
}
