"use client"

import React, { useState } from "react"
import { VisualNode } from "./types"
import { analyzeFormulaCanvas, FormulaCanvasOutput } from "@/ai/flows/interactive-fragrance-canvas"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, AlertTriangle } from "lucide-react"

interface AiAnalysisPanelProps {
  nodes: VisualNode[]
}

export function AiAnalysisPanel({ nodes }: AiAnalysisPanelProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FormulaCanvasOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    try {
      // Flatten nodes to get ingredients
      const ingredients = nodes.flatMap(node => {
         if (node.type === 'ingredient' && node.data.ingredient) {
             return [{
                 name: node.data.ingredient.name,
                 concentration: node.data.concentration || 0
             }]
         }
         if (node.type === 'accord' && node.data.items) {
             return node.data.items.map(item => ({
                 name: item.data.ingredient?.name || item.data.label,
                 concentration: item.data.concentration || 0
             }))
         }
         return []
      }).filter(i => i.concentration > 0)

      if (ingredients.length === 0) {
          throw new Error("No ingredients found in the formula to analyze.")
      }

      const analysis = await analyzeFormulaCanvas({ ingredients })
      setResult(analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Scent Analysis
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAnalyze}
            disabled={loading || nodes.length === 0}
            className="h-7 text-xs border-slate-700 hover:bg-slate-800 text-purple-300 hover:text-purple-200"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
            {result ? "Re-Analyze" : "Analyze Composition"}
          </Button>
       </div>

       {error && (
         <div className="p-3 bg-red-900/20 border border-red-900/50 rounded text-xs text-red-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
         </div>
       )}

       {result && (
         <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                <h4 className="text-xs font-mono uppercase text-purple-400 mb-2">Scent Profile</h4>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{result.finalScentProfile}"
                </p>
            </div>

            <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 mb-2">Projected Performance</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-zinc-900 p-2 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">Longevity</div>
                        <div className="text-xs font-medium text-slate-200">{result.longevityEstimate}</div>
                    </div>
                    <div className="bg-zinc-900 p-2 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">Projection</div>
                        <div className="text-xs font-medium text-slate-200">{result.projectionEstimate}</div>
                    </div>
                </div>
            </div>

             <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 mb-2">Key Interactions</h4>
                <div className="space-y-2">
                    {result.ingredientInteractions.map((interaction, i) => (
                        <div key={i} className="p-2 bg-zinc-900 rounded border border-slate-800 text-xs">
                             <div className="flex flex-wrap gap-1 mb-1">
                                {interaction.ingredients.map(ing => (
                                    <span key={ing} className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">
                                        {ing}
                                    </span>
                                ))}
                             </div>
                             <p className="text-slate-400 leading-snug">{interaction.effect}</p>
                        </div>
                    ))}
                </div>
            </div>
         </div>
       )}
       {!result && !loading && !error && (
           <div className="text-center py-8 text-slate-600 text-xs italic border-2 border-dashed border-slate-800 rounded-lg">
                Run analysis to generate insights for {nodes.length} nodes.
           </div>
       )}
    </div>
  )
}
