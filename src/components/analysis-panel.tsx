"use client"

import React from 'react'
import { type Formula } from '@/lib/types'
// Import new chart components
import { PyramidChart } from '@/components/charts/pyramid-chart'
import { LongevityChart } from '@/components/charts/longevity-chart'
import { CostPieChart } from '@/components/charts/cost-pie-chart'
import { AllergenGauge } from '@/components/charts/allergen-gauge'

// Re-using the SummaryCard logic but maybe simplifying or enhancing it
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from './ui/separator'

const SummaryCard = ({ formula }: { formula: Formula }) => {
  const summary = React.useMemo(() => {
    const totalWeight = formula.ingredients.reduce((acc, ing) => acc + ing.concentration, 0)
    const pureMaterialWeight = formula.ingredients
      .filter(i => i.name.toLowerCase() !== 'ethanol')
      .reduce((acc, ing) => acc + (ing.concentration * ((ing.dilution || 100) / 100)), 0)

    const solventWeight = totalWeight - pureMaterialWeight;
    const finalDilution = totalWeight > 0 ? (pureMaterialWeight / totalWeight) * 100 : 0;
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
        <MetricItem label="Final Dilution" value={`${summary.finalDilution.toFixed(2)}%`} />
        <Separator />
        <MetricItem label="Est. Cost / 100g" value={`$${(summary.totalCost * 100).toFixed(2)}`} />
      </CardContent>
    </Card>
  )
}

export const AnalysisPanel = React.memo(function AnalysisPanel({ formula }: { formula: Formula }) {
  return (
    <div className="space-y-6">
      <SummaryCard formula={formula} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        <PyramidChart formula={formula} />
        <LongevityChart formula={formula} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AllergenGauge formula={formula} />
        <CostPieChart formula={formula} />
      </div>
    </div>
  )
})
