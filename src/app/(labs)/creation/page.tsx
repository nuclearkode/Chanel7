"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { FormulaEditor } from "@/components/formula-editor"
import { AnalysisPanel } from "@/components/analysis-panel"
import { EvaluationTimeline } from "@/components/formulas/evaluation-timeline"
import { ExportPanel } from "@/components/formulas/export-panel"
import { DilutionCalculator } from "@/components/tools/dilution-calculator"
import { type Formula, type Ingredient, type Evaluation } from "@/lib/types"
import { allFormulas, initialFormula } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Beaker, Save, Plus, Sparkles } from "lucide-react"

export default function CreationLabPage() {
    const searchParams = useSearchParams()
    const { toast } = useToast()

    const [formula, setFormula] = React.useState<Formula>(initialFormula)
    const [formulas] = React.useState<Formula[]>(allFormulas)

    React.useEffect(() => {
        const formulaId = searchParams.get('formula')
        const isNew = searchParams.get('new')

        if (isNew) {
            setFormula({
                id: `formula-${Date.now()}`,
                name: "Untitled Formula",
                ingredients: [],
            })
            return
        }

        if (formulaId) {
            const foundFormula = formulas.find(f => f.id === formulaId)
            if (foundFormula) {
                setFormula(foundFormula)
            }
        }
    }, [searchParams, formulas])

    const handleFormulaChange = (newFormula: Formula) => {
        const totalConcentration = newFormula.ingredients.reduce((acc, ing) => acc + ing.concentration, 0)
        if (totalConcentration > 100) {
            toast({
                variant: "destructive",
                title: "Warning: Concentration Exceeds 100%",
                description: `Total is ${totalConcentration.toFixed(2)}%. Adjust your formula.`,
            })
        }
        setFormula(newFormula)
    }

    const handleAddEvaluation = (newEvalData: Omit<Evaluation, 'id'>) => {
        const newEval: Evaluation = { ...newEvalData, id: `eval-${Date.now()}` }
        setFormula(prev => ({
            ...prev,
            evaluations: [...(prev.evaluations || []), newEval]
        }))
    }

    const handleNewFormula = () => {
        setFormula({
            id: `formula-${Date.now()}`,
            name: "Untitled Formula",
            ingredients: [],
        })
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                        <Beaker className="w-6 h-6" />
                    </span>
                    <div>
                        <Input
                            value={formula.name}
                            onChange={(e) => setFormula(prev => ({ ...prev, name: e.target.value }))}
                            className="text-2xl font-bold font-headline border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                        />
                        <p className="text-sm text-muted-foreground">
                            {formula.ingredients.length} ingredients • {formula.ingredients.reduce((a, i) => a + i.concentration, 0).toFixed(1)}% total
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleNewFormula}>
                        <Plus className="w-4 h-4 mr-2" /> New
                    </Button>
                    <Button>
                        <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: Editor */}
                <div className="xl:col-span-2 space-y-6">
                    <FormulaEditor formula={formula} onFormulaChange={handleFormulaChange} />

                    {/* Tools Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DilutionCalculator />
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-headline flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" /> AI Suggestions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">Get AI-powered recommendations for your formula</p>
                                <Button variant="outline" className="w-full">Generate Suggestions</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right: Analysis */}
                <div className="space-y-6">
                    <AnalysisPanel formula={formula} />
                    <EvaluationTimeline formula={formula} onAddEvaluation={handleAddEvaluation} />
                    <ExportPanel formula={formula} />
                </div>
            </div>
        </div>
    )
}
