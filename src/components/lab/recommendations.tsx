"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus } from "lucide-react"
import { usePerfume } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function Recommendations() {
  const { state, dispatch } = usePerfume()
  const { toast } = useToast()

  const handleAdd = (name: string) => {
    const ingredient = state.inventory.find(i => i.name === name)
    if (ingredient) {
      dispatch({ type: "ADD_TO_FORMULA", payload: ingredient })
      toast({
        title: "Ingredient Added",
        description: `${name} has been added to your formula.`,
      })
    }
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-primary w-4 h-4" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">AI Suggested Pairings</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => handleAdd("Vetiver Haiti")} variant="outline" className="group flex items-center gap-3 pl-2 pr-3 py-1.5 h-auto rounded-full border-border bg-card hover:border-primary/50 hover:bg-primary/10 transition-all text-xs text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center font-bold text-[10px] border border-green-800">V</div>
          <div className="text-left">
            <div className="font-semibold text-foreground group-hover:text-primary">Vetiver Haiti</div>
            <div className="text-[10px] text-muted-foreground">Base Note</div>
          </div>
          <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary ml-1" />
        </Button>
        <Button onClick={() => handleAdd("Lavender Abs.")} variant="outline" className="group flex items-center gap-3 pl-2 pr-3 py-1.5 h-auto rounded-full border-border bg-card hover:border-primary/50 hover:bg-primary/10 transition-all text-xs text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-purple-900/50 text-purple-400 flex items-center justify-center font-bold text-[10px] border border-purple-800">L</div>
          <div className="text-left">
            <div className="font-semibold text-foreground group-hover:text-primary">Lavender Abs.</div>
            <div className="text-[10px] text-muted-foreground">Heart Note</div>
          </div>
          <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary ml-1" />
        </Button>
        <Button onClick={() => handleAdd("Mandarin Red")} variant="outline" className="group flex items-center gap-3 pl-2 pr-3 py-1.5 h-auto rounded-full border-border bg-card hover:border-primary/50 hover:bg-primary/10 transition-all text-xs text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-orange-900/50 text-orange-400 flex items-center justify-center font-bold text-[10px] border border-orange-800">M</div>
          <div className="text-left">
            <div className="font-semibold text-foreground group-hover:text-primary">Mandarin Red</div>
            <div className="text-[10px] text-muted-foreground">Top Note</div>
          </div>
          <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary ml-1" />
        </Button>
      </div>
    </div>
  )
}
