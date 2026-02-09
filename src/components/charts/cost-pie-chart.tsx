"use client"

import React from 'react'
import { Pie, PieChart, Cell, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { DollarSign } from 'lucide-react'
import { type Formula } from '@/lib/types'

export const CostPieChart = ({ formula }: { formula: Formula }) => {
    const data = React.useMemo(() => {
        let materialCost = 0
        let solventCost = 0

        // Mock packaging cost for demo
        const packagingCost = 2.50

        formula.ingredients.forEach(ing => {
            const cost = (ing.concentration * ing.cost) / 100 // Normalized cost
            if (ing.name.toLowerCase() === 'ethanol' || ing.name.toLowerCase().includes('solvent')) {
                solventCost += cost
            } else {
                materialCost += cost
            }
        })

        return [
            { name: 'Raw Materials', value: materialCost, fill: "hsl(var(--chart-1))" },
            { name: 'Solvent', value: solventCost, fill: "hsl(var(--chart-2))" },
            { name: 'Packaging (Est)', value: packagingCost, fill: "hsl(var(--chart-3))" },
        ]
    }, [formula])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <DollarSign className="text-primary" /> Cost Breakdown
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        />
                        <Tooltip content={<ChartTooltipContent hideLabel />} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
