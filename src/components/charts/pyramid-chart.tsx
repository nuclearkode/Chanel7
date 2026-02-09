"use client"

import React from 'react'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { Pyramid } from 'lucide-react'
import { type Formula, type Note } from '@/lib/types'

// Helper to partition notes into 5 layers based on mock logic 
// In a real app, 'Upper Mid' vs 'Heart' would be distinct properties in the DB
const getExtendedNote = (note: Note, name: string): string => {
    // Mock logic to distribute existing Top/Mid/Base into 5 layers
    if (note === 'Top') return 'Top'
    if (note === 'Mid') {
        // Arbitrary split for demo purposes
        if (['Jasmine', 'Rose', 'Ylang'].some(n => name.includes(n))) return 'Heart'
        return 'Upper Mid'
    }
    if (note === 'Base') {
        if (['Musk', 'Amber', 'Vanilla'].some(n => name.includes(n))) return 'Dry Down'
        return 'Base'
    }
    return note
}

export const PyramidChart = ({ formula }: { formula: Formula }) => {
    const pyramidData = React.useMemo(() => {
        const layers = {
            'Top': 0,
            'Upper Mid': 0,
            'Heart': 0,
            'Lower Mid': 0, // Using Base for this in mapping
            'Dry Down': 0,
            'Base': 0
        } as Record<string, number>;

        formula.ingredients.forEach(ing => {
            if (ing.name.toLowerCase() !== 'ethanol') {
                const extendedNote = getExtendedNote(ing.note, ing.name)
                // Map 'Base' to 'Lower Mid' if it's not 'Dry Down'
                if (extendedNote === 'Base') layers['Lower Mid'] += ing.concentration
                else layers[extendedNote] += ing.concentration
            }
        });

        const total = Object.values(layers).reduce((a, b) => a + b, 0);
        if (total === 0) return [];

        // Order matters for stacking: Top -> Base
        return [
            { note: 'Top', value: (layers['Top'] / total) * 100, fill: "hsl(var(--chart-2))" },
            { note: 'Upper Mid', value: (layers['Upper Mid'] / total) * 100, fill: "hsl(var(--chart-3))" },
            { note: 'Heart', value: (layers['Heart'] / total) * 100, fill: "hsl(var(--chart-1))" },
            { note: 'Lower Mid', value: (layers['Lower Mid'] / total) * 100, fill: "hsl(var(--chart-4))" },
            { note: 'Dry Down', value: (layers['Dry Down'] / total) * 100, fill: "hsl(var(--chart-5))" },
        ].filter(d => d.value > 0);
    }, [formula]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Pyramid className="text-primary" /> 5-Layer Pyramid
                </CardTitle>
            </CardHeader>
            <CardContent>
                {pyramidData.length > 0 ? (
                    <ChartContainer config={{}} className="w-full h-64">
                        <BarChart layout="vertical" data={pyramidData} stackOffset="expand">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="note" hide />
                            <Bar dataKey="value" fill="var(--color-value)" radius={4}>
                                <LabelList dataKey="note" position="insideLeft" offset={8} className="fill-white font-semibold text-xs" />
                                <LabelList
                                    dataKey="value"
                                    position="insideRight"
                                    offset={8}
                                    className="fill-white text-xs"
                                    formatter={(value: number) => `${value.toFixed(1)}%`}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                ) : <p className="text-muted-foreground text-center py-10">Add ingredients to see the pyramid.</p>}
            </CardContent>
        </Card>
    );
};
