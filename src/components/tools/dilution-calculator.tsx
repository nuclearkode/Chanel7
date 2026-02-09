"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator, ArrowRight, RefreshCcw } from 'lucide-react'

export function DilutionCalculator() {
    const [mass, setMass] = React.useState<number | ''>('') // g
    const [currentConc, setCurrentConc] = React.useState<number | ''>('') // %
    const [targetConc, setTargetConc] = React.useState<number | ''>('') // %
    const [result, setResult] = React.useState<number | null>(null)

    const calculate = () => {
        if (mass === '' || currentConc === '' || targetConc === '') return

        // Logic: (Mass * Current%) / Target% = TotalMass
        // SolventToAdd = TotalMass - Mass

        // Example: 10g @ 100% -> Target 10%
        // (10 * 1) / 0.1 = 100g Total
        // Add 90g solvent

        const c1 = Number(currentConc) / 100
        const c2 = Number(targetConc) / 100
        const m1 = Number(mass)

        if (c2 >= c1) {
            alert("Target concentration must be lower than current concentration")
            return
        }

        const m2 = (m1 * c1) / c2
        const solventToAdd = m2 - m1

        setResult(solventToAdd)
    }

    const reset = () => {
        setMass('')
        setCurrentConc('')
        setTargetConc('')
        setResult(null)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" /> Dilution Calculator
                </CardTitle>
                <CardDescription>Calculate solvent needed to reach target concentration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Current Mass (g)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 10"
                            value={mass}
                            onChange={(e) => setMass(Number(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Current Conc (%)</Label>
                        <Input
                            type="number"
                            placeholder="e.g. 100"
                            value={currentConc}
                            onChange={(e) => setCurrentConc(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Target Concentration (%)</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 10"
                        value={targetConc}
                        onChange={(e) => setTargetConc(Number(e.target.value))}
                    />
                </div>

                <div className="flex gap-2">
                    <Button onClick={calculate} className="flex-1" disabled={!mass || !currentConc || !targetConc}>
                        Calculate
                    </Button>
                    <Button variant="outline" onClick={reset}>
                        <RefreshCcw className="w-4 h-4" />
                    </Button>
                </div>

                {result !== null && (
                    <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Add Solvent:</p>
                            <p className="text-2xl font-bold text-primary">{result.toFixed(2)}g</p>
                        </div>
                        <ArrowRight className="text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Final Mass:</p>
                            <p className="text-xl font-bold">{(Number(mass) + result).toFixed(2)}g</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
