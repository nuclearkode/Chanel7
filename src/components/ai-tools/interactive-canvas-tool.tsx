"use client"

import * as React from "react"
import { Loader2, Sparkles, WandSparkles, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { allFormulas } from "@/lib/data"
import { Ingredient, Formula } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"
import { useToast } from "@/hooks/use-toast"
import { analyzeFormulaCanvas, type FormulaCanvasInput, type FormulaCanvasOutput } from "@/ai/flows/interactive-fragrance-canvas"
import { Separator } from "../ui/separator"
import { AnalysisPanel } from "../analysis-panel"

const uniqueIngredients = Array.from(new Map(allFormulas.flatMap(f => f.ingredients).map(item => [item.name, item])).values())
    .sort((a, b) => a.name.localeCompare(b.name));


export function InteractiveCanvasTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<FormulaCanvasOutput | null>(null)
  const [formula, setFormula] = React.useState<Formula>({ id: 'canvas', name: 'Live Canvas', ingredients: []})
  const { toast } = useToast()

  const handleAddIngredient = (ingredientName: string) => {
    const existingIngredient = formula.ingredients.find(ing => ing.name === ingredientName);
    if (existingIngredient) {
        toast({
            variant: "destructive",
            title: "Ingredient already added",
            description: `${ingredientName} is already on your canvas.`
        })
        return;
    }
    const ingredientToAdd = uniqueIngredients.find(ing => ing.name === ingredientName);
    if (ingredientToAdd) {
        setFormula(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, {...ingredientToAdd, concentration: 1}]
        }));
    }
  }

  const handleUpdateConcentration = (id: string, concentration: number) => {
     setFormula(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(ing => ing.id === id ? {...ing, concentration: isNaN(concentration) ? 0 : concentration} : ing)
     }));
  }
  
  const handleRemoveIngredient = (id: string) => {
    setFormula(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }));
  }

  async function handleAnalyze() {
    if (formula.ingredients.length < 2) {
        toast({
            variant: "destructive",
            title: "Not enough ingredients",
            description: "Please add at least two ingredients to analyze."
        })
        return;
    }
    
    const totalConcentration = formula.ingredients.reduce((acc, ing) => acc + ing.concentration, 0);
    if (totalConcentration > 100) {
      toast({
        variant: "destructive",
        title: "Warning: Concentration Exceeds 100%",
        description: `Total concentration is ${totalConcentration.toFixed(2)}%. The AI analysis will be based on these proportions, but the formula is unbalanced.`,
      })
    }

    setIsLoading(true)
    setResult(null)
    try {
      const input: FormulaCanvasInput = {
          ingredients: formula.ingredients.map(i => ({ name: i.name, concentration: i.concentration }))
      }
      const aiResult = await analyzeFormulaCanvas(input);
      setResult(aiResult);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: error.message || "An unknown error occurred.",
      })
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <WandSparkles className="text-primary" /> Interactive Fragrance Canvas
        </CardTitle>
        <CardDescription>
          Build a formula step-by-step and get real-time AI analysis on the scent profile, ingredient interactions, and performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT SIDE: Builder */}
            <div className="space-y-4">
                <CardTitle className="text-lg">Canvas Builder</CardTitle>
                <div className="flex gap-2">
                    <Select onValueChange={handleAddIngredient}>
                        <SelectTrigger>
                            <SelectValue placeholder="Add an ingredient from inventory..." />
                        </SelectTrigger>
                        <SelectContent>
                           {uniqueIngredients.map(ing => (
                               <SelectItem key={ing.id} value={ing.name}>{ing.name}</SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {formula.ingredients.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10 border-dashed border-2 rounded-lg">
                            <p>Add ingredients to get started</p>
                        </div>
                    ) : formula.ingredients.map(ing => (
                        <div key={ing.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                            <span className="font-medium flex-1">{ing.name}</span>
                            <Input 
                                type="number" 
                                className="w-24 h-8"
                                value={ing.concentration}
                                onChange={e => handleUpdateConcentration(ing.id, parseFloat(e.target.value))}
                                min="0"
                                step="0.1"
                                aria-label={`Concentration for ${ing.name}`}
                            />
                            <span className="text-muted-foreground">%</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveIngredient(ing.id)}>
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Remove {ing.name}</span>
                            </Button>
                        </div>
                    ))}
                </div>

                {formula.ingredients.length > 0 && (
                    <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
                        {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2"/>Analyze Formula</>}
                    </Button>
                )}
            </div>

            {/* RIGHT SIDE: Analysis */}
            <div className="space-y-4">
                 <CardTitle className="text-lg">AI Analysis & Visualization</CardTitle>
                 {isLoading && (
                     <div className="flex flex-col items-center justify-center gap-4 py-12 rounded-lg border-dashed border-2">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">The AI is smelling your creation...</p>
                    </div>
                 )}

                {result ? (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-primary">Final Scent Profile</h3>
                            <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-md">{result.finalScentProfile}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-primary">Ingredient Interactions</h3>
                            <ul className="space-y-2 mt-1">
                                {result.ingredientInteractions.map((interaction, i) => (
                                    <li key={i} className="text-sm p-3 bg-muted/50 rounded-md">
                                        <span className="font-semibold">{interaction.ingredients.join(' + ')}:</span>
                                        <span className="text-muted-foreground ml-2">{interaction.effect}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4">
                                <CardTitle className="text-sm font-semibold">Longevity</CardTitle>
                                <CardDescription>{result.longevityEstimate}</CardDescription>
                            </Card>
                            <Card className="p-4">
                                <CardTitle className="text-sm font-semibold">Projection</CardTitle>
                                <CardDescription>{result.projectionEstimate}</CardDescription>
                            </Card>
                        </div>
                    </div>
                ) : !isLoading && (
                     <div className="text-center text-muted-foreground py-10 border-dashed border-2 rounded-lg h-full flex items-center justify-center">
                        <p>Analysis will appear here</p>
                    </div>
                )}
            </div>
        </div>
        <Separator />
        <div>
            <AnalysisPanel formula={formula} />
        </div>
      </CardContent>
    </Card>
  )
}
