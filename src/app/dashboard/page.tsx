"use client"

import * as React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { FormulaEditor } from "@/components/formula-editor"
import { AnalysisPanel } from "@/components/analysis-panel"
import { EvaluationTimeline } from "@/components/formulas/evaluation-timeline"
import { ExportPanel } from "@/components/formulas/export-panel"
import { type Formula, type Ingredient, type Evaluation } from "@/lib/types"
import { allFormulas, initialFormula } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"

function DashboardPageContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [formula, setFormula] = React.useState<Formula>(initialFormula)
  const [formulas] = React.useState<Formula[]>(allFormulas)
  const allIngredients = React.useMemo(() => formulas.flatMap(f => f.ingredients), [formulas])

  React.useEffect(() => {
    const formulaId = searchParams.get('formula')
    const isNew = searchParams.get('new')

    if (isNew) {
      setFormula({
        id: `formula-${Date.now()}`,
        name: "Untitled Formula",
        ingredients: [],
      })
      return;
    }

    if (formulaId) {
      const foundFormula = formulas.find(f => f.id === formulaId)
      if (foundFormula) {
        setFormula(foundFormula)
      } else {
        setFormula(initialFormula)
      }
    } else {
      setFormula(initialFormula)
    }
  }, [searchParams, formulas])

  const handleFormulaChange = (newFormula: Formula) => {
    const totalConcentration = newFormula.ingredients.reduce((acc, ing) => acc + ing.concentration, 0);
    if (totalConcentration > 100) {
      toast({
        variant: "destructive",
        title: "Warning: Concentration Exceeds 100%",
        description: `Total concentration is ${totalConcentration.toFixed(2)}%. Please adjust your formula.`,
      })
    }
    setFormula(newFormula);
  }

  const handleNewFormulaCheck = () => {
    setFormula({
      id: `formula-${Date.now()}`,
      name: "Untitled Formula",
      ingredients: [],
    })
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

  const handleAddEvaluation = (newEvalData: Omit<Evaluation, 'id'>) => {
    const newEval: Evaluation = {
      ...newEvalData,
      id: `eval-${Date.now()}`
    }
    const updatedFormula = {
      ...formula,
      evaluations: [...(formula.evaluations || []), newEval]
    }
    setFormula(updatedFormula)
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-muted/20">
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full space-y-6">
            <DashboardHeader formulaName={formula.name} onNewFormula={handleNewFormulaFromAI} />

            {/* Command Center Top Section */}
            <div className="space-y-6">
              <StatsCards formulas={formulas} ingredients={allIngredients} />
              <QuickActions onNewFormula={handleNewFormulaCheck} />
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <div className="xl:col-span-2">
                <FormulaEditor formula={formula} onFormulaChange={handleFormulaChange} />
              </div>
              <div className="space-y-6">
                <AnalysisPanel formula={formula} />
                <EvaluationTimeline formula={formula} onAddEvaluation={handleAddEvaluation} />
                <ExportPanel formula={formula} />
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
