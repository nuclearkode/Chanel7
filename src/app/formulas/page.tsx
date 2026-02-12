"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Grid3X3 } from "lucide-react"
import { ComparisonTool } from "@/components/formulas/comparison-tool"
import { FormulaCard } from "@/components/formulas/formula-card"
import { usePerfume } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function FormulasPage() {
  const { state, dispatch } = usePerfume()
  const router = useRouter()

  const handleCreateFormula = () => {
    dispatch({ type: "CLEAR_FORMULA" })
    router.push("/lab")
  }

  const handleLoadFormula = (id: string) => {
    dispatch({ type: "LOAD_FORMULA", payload: id })
    router.push("/lab")
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Bar */}
      <header className="h-16 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 shrink-0 z-20 sticky top-0">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold font-display text-foreground">Formulas & Comparison</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    className="pl-9 pr-4 py-2 bg-secondary/50 border-transparent focus:bg-background rounded-lg text-sm w-64"
                    placeholder="Search formulas..."
                  />
                </div>
                <Button onClick={handleCreateFormula} className="shadow-lg shadow-primary/20 gap-2">
                  <Plus className="w-4 h-4" /> New Formula
                </Button>
              </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {/* SECTION 1: Formula Gallery */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold font-display text-foreground flex items-center gap-2">
                    <Grid3X3 className="text-primary w-5 h-5" />
                    Recent Formulas
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-7">Sort by Date</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7">Filter: All Types</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {state.formulas.map((formula) => (
                    <FormulaCard
                      key={formula.id}
                      formula={formula}
                      onClick={() => handleLoadFormula(formula.id)}
                    />
                  ))}
                  {/* Empty state if no formulas? But default store has one. */}
                </div>
              </section>

        {/* SECTION 2: Comparison Tool */}
        <section className="mt-8">
          <ComparisonTool />
        </section>
      </div>
    </div>
  )
}
