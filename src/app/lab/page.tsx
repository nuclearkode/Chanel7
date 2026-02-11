"use client"

import React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { FormulaHeader } from "@/components/lab/formula-header"
import { DilutantConfig } from "@/components/lab/dilutant-config"
import { IngredientsTable } from "@/components/lab/ingredients-table"
import { Recommendations } from "@/components/lab/recommendations"
import { LiveStats } from "@/components/lab/live-stats"
import { usePerfume } from "@/lib/store"

export default function LabPage() {
  const { state, dispatch } = usePerfume()
  const { activeFormula } = state

  // Calculate Totals
  const ingredientsWeight = activeFormula.items.reduce((sum, i) => sum + i.amount, 0)
  const totalWeight = activeFormula.solventAmount + ingredientsWeight

  // Oil Concentration: (Ingredients Weight / Total Weight) * 100
  const oilConcentration = totalWeight > 0 ? (ingredientsWeight / totalWeight) * 100 : 0

  const handleUpdateQuantity = (ingredientId: string, amount: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { ingredientId, amount } })
  }

  const handleRemoveIngredient = (ingredientId: string) => {
    dispatch({ type: "REMOVE_FROM_FORMULA", payload: ingredientId })
  }

  const handleSetSolvent = (solvent: string) => {
    dispatch({ type: "SET_SOLVENT", payload: { solvent, amount: activeFormula.solventAmount } })
  }

  const handleSetSolventWeight = (weight: number) => {
    dispatch({ type: "SET_SOLVENT", payload: { solvent: activeFormula.solvent, amount: weight } })
  }

  const handleSetFormulaName = (name: string) => {
    dispatch({ type: "SET_FORMULA_NAME", payload: name })
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100vh-4rem)]">
            {/* Left Pane: Editor (Scrollable) */}
            <section className="flex-1 flex flex-col min-w-0 border-r border-border bg-background overflow-y-auto">
              <FormulaHeader
                formulaName={activeFormula.name}
                setFormulaName={handleSetFormulaName}
              />

              <div className="p-6 pt-0">
                <DilutantConfig
                  solvent={activeFormula.solvent}
                  setSolvent={handleSetSolvent}
                  solventWeight={activeFormula.solventAmount}
                  setSolventWeight={handleSetSolventWeight}
                  totalWeight={totalWeight}
                />

                <div className="pt-6">
                  <IngredientsTable
                    items={activeFormula.items}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveIngredient}
                    totalWeight={totalWeight}
                  />
                  <Recommendations />
                </div>
              </div>
            </section>

            {/* Right Pane: Live Stats (Fixed width) */}
            <LiveStats
              totalWeight={totalWeight}
              oilConcentration={oilConcentration}
              items={activeFormula.items}
            />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
