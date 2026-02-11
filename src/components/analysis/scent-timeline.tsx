"use client"

import React, { useMemo } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"
import { type FormulaItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface ScentTimelineProps {
  items: FormulaItem[]
}

export function ScentTimeline({ items }: ScentTimelineProps) {
  const data = useMemo(() => {
    // Time points in hours
    const timePoints = [0, 0.25, 0.5, 1, 2, 4, 8, 12, 24, 48];

    return timePoints.map(t => {
       let top = 0, heart = 0, base = 0;

       items.forEach(item => {
          const { note, longevity, impact, concentration } = item.ingredient;
          const long = longevity || 4; // Default to 4h
          const imp = impact || 50;

          // Linear decay model: Intensity = Amount * Impact * (1 - t/Longevity)
          // Clamped at 0
          const remainingRatio = Math.max(0, 1 - (t / long));

          // Using item.amount which is grams.
          const intensity = item.amount * imp * remainingRatio;

          if (note === 'Top') top += intensity;
          else if (note === 'Mid') heart += intensity;
          else base += intensity;
       });

       return {
          time: t < 1 ? `${t*60}m` : `${t}h`,
          rawTime: t,
          top,
          heart,
          base
       };
    });
  }, [items]);

  const ingredientBars = useMemo(() => {
    // Sort by longevity desc
    return [...items].sort((a, b) => (b.ingredient.longevity || 0) - (a.ingredient.longevity || 0))
      .map(item => ({
         id: item.ingredient.id,
         name: item.ingredient.name,
         longevity: item.ingredient.longevity || 0,
         note: item.ingredient.note,
         impact: item.ingredient.impact || 50
      }));
  }, [items]);

  const maxLongevity = Math.max(...ingredientBars.map(i => i.longevity), 1);

  // Calculate Stats
  const stats = useMemo(() => {
      if (items.length === 0) return { tenacity: 0, projection: 0, impact: 0 };

      const totalAmount = items.reduce((s, i) => s + i.amount, 0) || 1;
      const weightedLongevity = items.reduce((s, i) => s + (i.ingredient.longevity || 0) * i.amount, 0) / totalAmount;
      const weightedImpact = items.reduce((s, i) => s + (i.ingredient.impact || 0) * i.amount, 0) / totalAmount;

      return {
          tenacity: weightedLongevity,
          projection: weightedImpact * 0.8, // Mock projection based on impact
          impact: weightedImpact
      };
  }, [items]);

  const getTenacityLabel = (h: number) => {
      if (h < 4) return "Fleeting";
      if (h < 8) return "Moderate";
      if (h < 24) return "Long Lasting";
      return "Eternal";
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Main Timeline Chart */}
      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
                <div>
                <CardTitle className="text-lg font-bold font-display text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Scent Timeline
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Predicted evaporation curve & note distribution</p>
                </div>
                <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded text-xs text-foreground">
                    <span className="w-2 h-2 rounded-full bg-cyan-300"></span> Top
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded text-xs text-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary"></span> Heart
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded text-xs text-foreground">
                    <span className="w-2 h-2 rounded-full bg-blue-900"></span> Base
                </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                    <linearGradient id="colorTop" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#67e8f9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    dy={10}
                    interval={0}
                    />
                    <YAxis hide />
                    <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "0.5rem" }}
                    itemStyle={{ color: "hsl(var(--popover-foreground))", fontSize: "12px" }}
                    formatter={(value: number) => value.toFixed(1)}
                    />
                    <Area type="monotone" dataKey="top" stackId="1" stroke="#67e8f9" fillOpacity={1} fill="url(#colorTop)" />
                    <Area type="monotone" dataKey="heart" stackId="1" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHeart)" />
                    <Area type="monotone" dataKey="base" stackId="1" stroke="#1e3a8a" fillOpacity={1} fill="url(#colorBase)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Tenacity</div>
                <div className="text-xl font-bold font-display text-foreground">{getTenacityLabel(stats.tenacity)}</div>
                <div className="text-xs text-primary mt-1 font-mono">~{stats.tenacity.toFixed(1)} Hours</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Projection</div>
                <div className="text-xl font-bold font-display text-foreground">{stats.projection > 70 ? "High" : stats.projection > 40 ? "Moderate" : "Intimate"}</div>
                <div className="text-xs text-primary mt-1 font-mono">Impact Score: {stats.projection.toFixed(0)}</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground mb-1">Avg. Impact</div>
                <div className="text-xl font-bold font-display text-foreground">{stats.impact.toFixed(0)}/100</div>
                <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${stats.impact}%` }}></div>
                </div>
                </div>
            </div>
        </CardContent>
      </Card>

      {/* Ingredient Longevity Visual */}
      <Card>
          <CardHeader>
              <CardTitle className="text-lg font-bold font-display">Ingredient Longevity</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {ingredientBars.map(ing => (
                      <div key={ing.id} className="flex items-center gap-3 text-sm">
                          <div className="w-[120px] truncate font-medium" title={ing.name}>{ing.name}</div>
                          <div className="flex-1">
                              <div className="relative h-6 bg-secondary/30 rounded-md overflow-hidden flex items-center">
                                  <div
                                    className={`h-full opacity-80 ${
                                        ing.note === 'Top' ? 'bg-cyan-300' :
                                        ing.note === 'Mid' ? 'bg-primary' : 'bg-blue-900'
                                    }`}
                                    style={{ width: `${Math.min(100, (ing.longevity / 48) * 100)}%` }} // Scale to 48h visually
                                  ></div>
                                  <span className="absolute inset-0 flex items-center px-2 text-xs font-mono text-foreground/80 mix-blend-difference">
                                      {ing.longevity}h
                                  </span>
                              </div>
                          </div>
                          <div className="w-[80px] text-right">
                              <Badge variant="outline" className="text-[10px] h-5">{ing.note}</Badge>
                          </div>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  )
}
