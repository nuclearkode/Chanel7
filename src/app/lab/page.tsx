"use client"

import React, { useState } from "react"
import { FormulaHeader } from "@/components/lab/formula-header"
import { DilutantConfig } from "@/components/lab/dilutant-config"
import { IngredientsTable } from "@/components/lab/ingredients-table"
import { Recommendations } from "@/components/lab/recommendations"
import { LiveStats } from "@/components/lab/live-stats"
import { usePerfume } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IngredientBrowser } from "@/components/ingredient-browser"
import { FormulaHistory } from "@/components/formula-history"
import { type Ingredient } from "@/lib/types"
import { ScentTimeline } from "@/components/analysis/scent-timeline"
import { VisualEditor } from "@/components/visual-lab/visual-editor"
import { ComparisonTool } from "@/components/formulas/comparison-tool"


export default function LabPage() {
  const { state, dispatch } = usePerfume()
  const { activeFormula } = state
  const [activeTab, setActiveTab] = useState("editor")

  // Calculate Totals
  const items = activeFormula.items || []
  const solventAmount = activeFormula.solventAmount || 0
  const solvent = activeFormula.solvent || "Perfumer's Alcohol"

  const ingredientsWeight = items.reduce((sum, i) => sum + i.amount, 0)
  const totalWeight = solventAmount + ingredientsWeight

  // Oil Concentration: (Ingredients Weight / Total Weight) * 100
  const oilConcentration = totalWeight > 0 ? (ingredientsWeight / totalWeight) * 100 : 0

  const handleUpdateQuantity = (ingredientId: string, amount: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { ingredientId, amount } })
  }

  const handleRemoveIngredient = (ingredientId: string) => {
    dispatch({ type: "REMOVE_FROM_FORMULA", payload: ingredientId })
  }

  const handleSetSolvent = (solventVal: string) => {
    dispatch({ type: "SET_SOLVENT", payload: { solvent: solventVal, amount: solventAmount } })
  }

  const handleSetSolventWeight = (weight: number) => {
    dispatch({ type: "SET_SOLVENT", payload: { solvent, amount: weight } })
  }

  const handleSetFormulaName = (name: string) => {
    dispatch({ type: "SET_FORMULA_NAME", payload: name })
  }

  const handleAddIngredient = (ingredient: Ingredient) => {
    // Check if ingredient already exists in formula
    if (activeFormula.items?.some(i => i.ingredient.id === ingredient.id)) {
        return;
    }
    dispatch({ type: "ADD_TO_FORMULA", payload: ingredient })
  }

  return (
    <main className="flex-1 flex flex-col lg:flex-row overflow-hidden h-full">
      {/* Left Pane: Editor (Scrollable) */}
      <section className="flex-1 flex flex-col min-w-0 border-r border-border bg-background overflow-y-auto">
              <FormulaHeader
                formulaName={activeFormula.name}
                setFormulaName={handleSetFormulaName}
              />

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="px-6 border-b bg-background/95 backdrop-blur z-10 sticky top-0">
                  <TabsList className="w-full justify-start h-12 bg-transparent p-0">
                   <TabsTrigger
                      value="visual"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      Visual Formula
                    </TabsTrigger>
                    <TabsTrigger
                      value="editor"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      Formula Editor
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      Analysis
                    </TabsTrigger>
                     <TabsTrigger
                      value="comparison"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      Comparison
                    </TabsTrigger>
                    <div className="flex-1"></div>
                    <TabsTrigger
                      value="history"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6 ml-auto"
                    >
                      History & Changes
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="visual" className="flex-1 p-0 mt-0 overflow-hidden h-full">
                   <VisualEditor />
                </TabsContent>

                <TabsContent value="editor" className="flex-1 p-6 pt-6 mt-0 space-y-6">
                  <DilutantConfig
                    solvent={solvent}
                    setSolvent={handleSetSolvent}
                    solventWeight={solventAmount}
                    setSolventWeight={handleSetSolventWeight}
                    totalWeight={totalWeight}
                  />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg font-display">Ingredients</h3>
                      <IngredientBrowser onAdd={handleAddIngredient} />
                    </div>
                    <IngredientsTable
                      items={items}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveIngredient}
                      totalWeight={totalWeight}
                    />
                  </div>

                  <Recommendations />
                </TabsContent>

                <TabsContent value="analysis" className="flex-1 p-6 mt-0 overflow-y-auto">
                   <div className="max-w-4xl mx-auto h-full">
                      <ScentTimeline items={items} />
                   </div>
                </TabsContent>

                 <TabsContent value="comparison" className="flex-1 p-6 mt-0 overflow-y-auto">
                   <div className="max-w-6xl mx-auto h-full">
                      <ComparisonTool />
                   </div>
                </TabsContent>

                <TabsContent value="history" className="flex-1 p-6 mt-0 overflow-y-auto">
                   <div className="max-w-3xl mx-auto">
                      <FormulaHistory history={activeFormula.history} />
                   </div>
                </TabsContent>

              </Tabs>
            </section>

      {/* Right Pane: Live Stats (Fixed width) */}
      {activeTab !== "visual" && (
        <LiveStats
            totalWeight={totalWeight}
            oilConcentration={oilConcentration}
            items={items}
        />
      )}
    </main>
  )
}
