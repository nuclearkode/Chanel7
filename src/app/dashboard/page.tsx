"use client"

import * as React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { FormulaEditor } from "@/components/formula-editor"
import { AnalysisPanel } from "@/components/analysis-panel"
import { type Formula, type Ingredient } from "@/lib/types"
import { allFormulas, initialFormula } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

function DashboardPageContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [formula, setFormula] = React.useState<Formula>(initialFormula)

  React.useEffect(() => {
    const formulaId = searchParams.get('formula')
    const foundFormula = allFormulas.find(f => f.id === formulaId)
    if (foundFormula) {
        setFormula(foundFormula)
    }
  }, [searchParams])

  const handleFormulaChange = (newFormula: Formula) => {
    const totalConcentration = newFormula.ingredients.reduce((acc, ing) => acc + ing.concentration, 0);
    if (totalConcentration > 100) {
      toast({
        variant: "destructive",
        title: "Warning: Concentration Exceeds 100%",
        description: `Total concentration is ${totalConcentration.toFixed(2)}%. Please adjust your formula.`,
      })
    }
    const updatedFormulas = allFormulas.map(f => f.id === newFormula.id ? newFormula : f);
    // This is a mock update. In a real app, you'd save this to a backend.
    console.log("Formula updated (in memory):", updatedFormulas);
    setFormula(newFormula);
  }

  const handleNewFormulaFromAI = (newFormulaData: Record<string, number>, notes: string) => {
    const newIngredients: Ingredient[] = Object.entries(newFormulaData).map(([name, amount], index) => ({
      id: `ai-${Date.now()}-${index}`,
      name,
      concentration: amount,
      vendor: "AI Generated",
      dilution: 100,
      cost: 0,
      note: "Mid",
      olfactiveFamilies: [],
      isAllergen: false,
      ifraLimit: 100,
    }));
    
    const currentTotal = newIngredients.reduce((acc, ing) => acc + ing.concentration, 0);
    if (currentTotal < 100) {
        newIngredients.push({
            id: `ai-ethanol-${Date.now()}`,
            name: "Ethanol",
            concentration: 100 - currentTotal,
            vendor: "Solvent",
            dilution: 100,
            cost: 0.01,
            note: "Top",
            olfactiveFamilies: [],
            isAllergen: false,
            ifraLimit: 100,
        })
    }

    setFormula({
      id: `ai-formula-${Date.now()}`,
      name: "AI Generated Spark",
      ingredients: newIngredients,
    })

    toast({
      title: "AI Formula Applied!",
      description: notes,
    })
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <DashboardHeader formulaName={formula.name} onNewFormula={handleNewFormulaFromAI} />
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <div className="xl:col-span-2">
                <FormulaEditor formula={formula} onFormulaChange={handleFormulaChange} />
              </div>
              <div className="space-y-6">
                <AnalysisPanel formula={formula} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}


export default function ScentForgeDashboard() {
  return (
    <React.Suspense>
      <DashboardPageContent />
    </React.Suspense>
  )
}
