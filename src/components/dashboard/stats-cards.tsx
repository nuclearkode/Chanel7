"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FlaskConical, AlertTriangle, Package, DollarSign } from "lucide-react"
import { type Formula, type Ingredient } from "@/lib/types"

interface StatsCardsProps {
    formulas: Formula[]
    ingredients: Ingredient[]
}

export function StatsCards({ formulas, ingredients }: StatsCardsProps) {
    // Calculate metrics
    const activeFormulas = formulas.length

    const lowStockCount = 3 // Mock data for now, would come from inventory state
    const expiringCount = 1 // Mock data

    const ifraWarnings = formulas.reduce((count, formula) => {
        const hasWarning = formula.ingredients.some(i => i.concentration > i.ifraLimit)
        return count + (hasWarning ? 1 : 0)
    }, 0)

    const avgCostPerGram = ingredients.length > 0
        ? ingredients.reduce((sum, i) => sum + i.cost, 0) / ingredients.length
        : 0

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Formulas</CardTitle>
                    <FlaskConical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeFormulas}</div>
                    <p className="text-xs text-muted-foreground">
                        +2 from last week
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{lowStockCount}</div>
                    <p className="text-xs text-muted-foreground">
                        {expiringCount} expiring soon
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">IFRA Warnings</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{ifraWarnings}</div>
                    <p className="text-xs text-muted-foreground">
                        Requires attention
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Material Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${avgCostPerGram.toFixed(2)}/g</div>
                    <p className="text-xs text-muted-foreground">
                        +4% from last month
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
