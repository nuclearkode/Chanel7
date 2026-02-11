"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, Loader2, RefreshCw } from "lucide-react"
import { usePerfume } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { suggestFormulaAdditions, type SuggestFormulaAdditionsOutput } from "@/ai/flows/suggest-formula-additions"

export function Recommendations() {
  const { state, dispatch } = usePerfume()
  const { toast } = useToast()
  const [suggestions, setSuggestions] = useState<SuggestFormulaAdditionsOutput["suggestions"]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const handleAdd = (name: string) => {
    // Check if ingredient exists in inventory
    const ingredient = state.inventory.find(i => i.name.toLowerCase() === name.toLowerCase())

    if (ingredient) {
      dispatch({ type: "ADD_TO_FORMULA", payload: ingredient })
      toast({
        title: "Ingredient Added",
        description: `${ingredient.name} has been added to your formula.`,
      })
    } else {
        toast({
            title: "Ingredient Not Found",
            description: `${name} is not in your inventory, but it's a great suggestion!`,
            variant: "destructive"
        })
    }
  }

  const fetchSuggestions = async () => {
    setIsLoading(true)
    try {
        const formulaItems = state.activeFormula.items.map(item => ({
            name: item.ingredient.name,
            amount: item.amount
        }))
        const availableIngredients = state.inventory.map(i => i.name)

        const result = await suggestFormulaAdditions({
            formulaItems,
            availableIngredients
        })
        setSuggestions(result.suggestions)
        setHasFetched(true)
    } catch (error) {
        console.error("Failed to fetch suggestions:", error)
        toast({
            title: "AI Error",
            description: "Failed to get suggestions. Please try again.",
            variant: "destructive"
        })
    } finally {
        setIsLoading(false)
    }
  }

  const getNoteStyles = (note: string) => {
    switch (note) {
        case 'Top': return "bg-orange-900/50 text-orange-400 border-orange-800"
        case 'Heart': return "bg-purple-900/50 text-purple-400 border-purple-800"
        case 'Base': return "bg-green-900/50 text-green-400 border-green-800"
        default: return "bg-slate-900/50 text-slate-400 border-slate-800"
    }
  }

  // Initial fetch on mount if not empty? Or just show a button.
  // The original UI showed buttons immediately (hardcoded).
  // Let's show a button to generate if not fetched.

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <Sparkles className="text-primary w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">AI Suggested Pairings</h3>
        </div>
        {!hasFetched && !isLoading && (
            <Button variant="ghost" size="sm" onClick={fetchSuggestions} className="h-6 text-xs">
                Generate Suggestions
            </Button>
        )}
        {hasFetched && !isLoading && (
             <Button variant="ghost" size="icon" onClick={fetchSuggestions} className="h-6 w-6">
                <RefreshCw className="h-3 w-3" />
            </Button>
        )}
      </div>

      {isLoading ? (
          <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="ml-2 text-xs text-muted-foreground">Analyzing formula...</span>
          </div>
      ) : (
          <div className="flex flex-wrap gap-3">
            {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                    <Button
                        key={index}
                        onClick={() => handleAdd(suggestion.name)}
                        variant="outline"
                        className="group flex items-center gap-3 pl-2 pr-3 py-1.5 h-auto rounded-full border-border bg-card hover:border-primary/50 hover:bg-primary/10 transition-all text-xs text-muted-foreground"
                        title={suggestion.reasoning}
                    >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${getNoteStyles(suggestion.note)}`}>
                        {suggestion.name.charAt(0)}
                    </div>
                    <div className="text-left">
                        <div className="font-semibold text-foreground group-hover:text-primary">{suggestion.name}</div>
                        <div className="text-[10px] text-muted-foreground">{suggestion.note} Note</div>
                    </div>
                    <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary ml-1" />
                    </Button>
                ))
            ) : (
                hasFetched && <span className="text-xs text-muted-foreground italic">No suggestions available.</span>
            )}
             {!hasFetched && !isLoading && (
                <div className="text-xs text-muted-foreground italic">
                    Click generate to get AI suggestions based on your current formula.
                </div>
            )}
          </div>
      )}
    </div>
  )
}
