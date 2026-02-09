"use client"

import React from 'react'
import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { AlertTriangle } from 'lucide-react'
import { type Formula } from '@/lib/types'

export const AllergenGauge = ({ formula }: { formula: Formula }) => {
    const allergenCount = React.useMemo(() => {
        return formula.ingredients.filter(i => i.isAllergen).length
    }, [formula])

    const maxAllergens = 26 // Old standard, or 82 for new
    const percentage = (allergenCount / maxAllergens) * 100

    const data = [{ name: 'Allergens', value: allergenCount, fill: "var(--color-value)" }]

    // Determine color based on severity
    const severityColor = allergenCount > 10 ? "hsl(var(--destructive))" : "hsl(var(--chart-2))"

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <AlertTriangle className="text-primary" /> Allergen Load
                </CardTitle>
                <CardDescription>Detected {allergenCount} allergens</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ value: { label: "Allergens", color: severityColor } }} className="h-48 w-full">
                    <RadialBarChart
                        data={data}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarAngleAxis type="number" domain={[0, maxAllergens]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey="value" cornerRadius={10} />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                            {allergenCount}
                        </text>
                        <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-xs">
                            / 26 monitored
                        </text>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
