"use client"

import React, { useMemo } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { type FormulaItem } from "@/lib/types"

interface FragranceRadarProps {
    items: FormulaItem[]
}

const FAMILIES = [
  "Woody", "Spicy", "Musky", "Floral", "Fruity", "Aquatic", "Citrus", "Green", "Amber", "Gourmand"
]

export function FragranceRadar({ items }: FragranceRadarProps) {
  const data = useMemo(() => {
    if (items.length === 0) {
        return FAMILIES.map(subject => ({ subject, A: 0, fullMark: 100 }))
    }

    const scores: Record<string, number> = {}
    FAMILIES.forEach(f => scores[f] = 0)

    let maxScore = 0

    items.forEach(item => {
        item.ingredient.olfactiveFamilies.forEach(family => {
            if (scores[family] !== undefined) {
                scores[family] += item.amount
            }
        })
    })

    // Find max to normalize
    Object.values(scores).forEach(s => {
        if (s > maxScore) maxScore = s
    })

    return FAMILIES.map(subject => ({
        subject,
        A: maxScore > 0 ? (scores[subject] / maxScore) * 100 : 0,
        fullMark: 100
    }))
  }, [items])

  // Find dominant
  const dominant = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.A - a.A)
    return {
        primary: sorted[0],
        secondary: sorted[1]
    }
  }, [data])

  return (
    <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-6 flex flex-col relative overflow-hidden h-full">
      <div className="flex justify-between items-start mb-6 z-10">
        <div>
          <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
            <span className="text-primary material-icons">fingerprint</span>
            Fragrance Fingerprint
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Olfactive profile based on {items.length} ingredients</p>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center relative min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Profile"
              dataKey="A"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span className="text-foreground font-medium">Dominant: {dominant.primary.subject} ({dominant.primary.A.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/40"></div>
          <span className="text-muted-foreground">Secondary: {dominant.secondary.subject} ({dominant.secondary.A.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  )
}
