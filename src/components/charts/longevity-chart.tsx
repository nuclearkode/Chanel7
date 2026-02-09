"use client"

import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Clock } from 'lucide-react'
import { type Formula } from '@/lib/types'

export const LongevityChart = ({ formula }: { formula: Formula }) => {
    // Mock simulation of scent evolution over time (0 - 8 hours)
    const data = React.useMemo(() => {
        if (formula.ingredients.length === 0) return []

        const timePoints = [0, 1, 2, 4, 6, 8]
        return timePoints.map(hour => {
            let intensity = 0
            formula.ingredients.forEach(ing => {
                if (ing.name.toLowerCase() === 'ethanol') return

                // Simple decay model based on Note
                let decayRate = 0.8 // Default heavy decay (Top)
                if (ing.note === 'Mid') decayRate = 0.4
                if (ing.note === 'Base') decayRate = 0.1

                // Intensity = Concentration * e^(-decay * time)
                const val = ing.concentration * Math.exp(-decayRate * hour)
                intensity += val
            })
            return { hour: `${hour}h`, intensity: Math.round(intensity * 10) / 10 }
        })
    }, [formula])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Clock className="text-primary" /> Projected Longevity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ intensity: { label: "Intensity", color: "hsl(var(--primary))" } }} className="h-48 w-full">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="intensity" stroke="var(--color-intensity)" fill="var(--color-intensity)" fillOpacity={0.2} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
