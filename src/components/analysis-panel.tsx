"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type Formula } from '@/lib/types'
import { Separator } from './ui/separator'
import { Bar, BarChart, CartesianGrid, LabelList, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Pyramid, Radar as RadarIcon } from 'lucide-react'

const SummaryCard = ({ formula }: { formula: Formula }) => {
  const summary = React.useMemo(() => {
    const totalWeight = formula.ingredients.reduce((acc, ing) => acc + ing.concentration, 0)
    const pureMaterialWeight = formula.ingredients
      .filter(i => i.name.toLowerCase() !== 'ethanol')
      .reduce((acc, ing) => acc + (ing.concentration * (ing.dilution / 100)), 0)
    
    const solventWeight = totalWeight - pureMaterialWeight;
    const finalDilution = (pureMaterialWeight / totalWeight) * 100;
    const totalCost = formula.ingredients.reduce((acc, ing) => acc + (ing.concentration * ing.cost), 0) / 100 // per formula unit
    
    return {
      totalWeight,
      pureMaterialWeight,
      solventWeight,
      finalDilution,
      totalCost,
      costPerMl: totalCost * 0.8 // Assuming density ~0.8g/ml
    }
  }, [formula])

  const MetricItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Summary Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <MetricItem label="Total Weight" value={`${summary.totalWeight.toFixed(2)}%`} />
        <MetricItem label="Pure Material" value={`${summary.pureMaterialWeight.toFixed(2)}%`} />
        <MetricItem label="Solvent" value={`${summary.solventWeight.toFixed(2)}%`} />
        <Separator />
        <MetricItem label="Final Dilution" value={`${summary.finalDilution.toFixed(2)}%`} />
        <MetricItem label="Total Cost / 100g" value={`$${(summary.totalCost * 100).toFixed(2)}`} />
        <MetricItem label="Cost per ml (est.)" value={`$${summary.costPerMl.toFixed(3)}`} />
      </CardContent>
    </Card>
  )
}

const FragrancePyramidChart = ({ formula }: { formula: Formula }) => {
    const pyramidData = React.useMemo(() => {
        const notes = { Top: 0, Mid: 0, Base: 0 };
        formula.ingredients.forEach(ing => {
            if (ing.name.toLowerCase() !== 'ethanol') {
                 notes[ing.note] += ing.concentration;
            }
        });
        const total = notes.Top + notes.Mid + notes.Base;
        if (total === 0) return [];
        return [
            { note: 'Top', value: (notes.Top / total) * 100, fill: "hsl(var(--chart-2))" },
            { note: 'Mid', value: (notes.Mid / total) * 100, fill: "hsl(var(--chart-1))" },
            { note: 'Base', value: (notes.Base / total) * 100, fill: "hsl(var(--chart-5))" },
        ];
    }, [formula]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Pyramid className="text-primary"/> Fragrance Pyramid
                </CardTitle>
            </CardHeader>
            <CardContent>
                {pyramidData.length > 0 ? (
                    <ChartContainer config={{}} className="w-full h-48">
                        <BarChart layout="vertical" data={pyramidData} stackOffset="expand">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="note" hide />
                             <Bar dataKey="value" fill="var(--color-value)" radius={4}>
                                <LabelList dataKey="note" position="insideLeft" offset={8} className="fill-white font-semibold" />
                                <LabelList
                                    dataKey="value"
                                    position="insideRight"
                                    offset={8}
                                    className="fill-white"
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


const OlfactiveFingerprintChart = ({ formula }: { formula: Formula }) => {
    const fingerprintData = React.useMemo(() => {
        const families: { [key: string]: number } = {};
        let total = 0;
        formula.ingredients.forEach(ing => {
            if (ing.name.toLowerCase() !== 'ethanol') {
                ing.olfactiveFamilies.forEach(family => {
                    if (!families[family]) families[family] = 0;
                    families[family] += ing.concentration;
                });
                total += ing.concentration;
            }
        });

        if (total === 0) return [];

        return Object.keys(families).map(family => ({
            family,
            value: (families[family] / total) * 100
        }));
    }, [formula]);

    const chartConfig = {
      value: { label: "Concentration", color: "hsl(var(--chart-1))" },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <RadarIcon className="text-primary"/> Olfactive Fingerprint
                </CardTitle>
            </CardHeader>
            <CardContent>
                {fingerprintData.length > 0 ? (
                <ChartContainer config={chartConfig} className="w-full h-64">
                    <RadarChart data={fingerprintData}>
                        <CartesianGrid gridType="circle" />
                        <PolarAngleAxis dataKey="family" />
                        <PolarGrid />
                         <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Radar
                            name="Concentration"
                            dataKey="value"
                            stroke="hsl(var(--chart-1))"
                            fill="hsl(var(--chart-1))"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ChartContainer>
                ) : <p className="text-muted-foreground text-center py-10">Add ingredients to see the fingerprint.</p>}
            </CardContent>
        </Card>
    );
};


export function AnalysisPanel({ formula }: { formula: Formula }) {
  return (
    <div className="space-y-6">
      <SummaryCard formula={formula} />
      <FragrancePyramidChart formula={formula} />
      <OlfactiveFingerprintChart formula={formula} />
    </div>
  )
}
