"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { type Ingredient } from '@/lib/types'
import { AlertTriangle, Clock, MapPin } from 'lucide-react'

// Mock extension of Ingredient type to include inventory-specific fields
// In a real app, these would be part of the DB schema
interface ExtendedIngredient extends Ingredient {
    stockAmount?: number // in grams
    maxStock?: number
    location?: string
    expiryDate?: string
}

export function IngredientCard({ ingredient }: { ingredient: ExtendedIngredient }) {
    // Mock data generation if missing
    const stock = ingredient.stockAmount || Math.floor(Math.random() * 100)
    const max = ingredient.maxStock || 100
    const percentage = (stock / max) * 100

    // Determine status color
    let statusColor = "bg-primary"
    if (percentage < 30) statusColor = "bg-yellow-500"
    if (percentage < 10) statusColor = "bg-destructive"

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold truncate pr-2" title={ingredient.name}>
                        {ingredient.name}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0 max-w-[80px] truncate">
                        {ingredient.vendor}
                    </Badge>
                </div>
                <div className="flex gap-1 flex-wrap mt-1">
                    {ingredient.olfactiveFamilies.map(fam => (
                        <Badge key={fam} variant="secondary" className="text-xs px-1 py-0 h-5">
                            {fam}
                        </Badge>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Stock Level */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Stock Level</span>
                        <span>{stock}g / {max}g</span>
                    </div>
                    <Progress value={percentage} className="h-2" indicatorClassName={statusColor} />
                    {percentage < 20 && (
                        <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                        </div>
                    )}
                </div>

                {/* Note & IFRA */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted/30 p-2 rounded">
                        <span className="text-xs text-muted-foreground block">Note</span>
                        <span className="font-medium">{ingredient.note}</span>
                    </div>
                    <div className="bg-muted/30 p-2 rounded">
                        <span className="text-xs text-muted-foreground block">IFRA Limit</span>
                        <span className="font-medium">{ingredient.ifraLimit}%</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0 flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {ingredient.location || 'Shelf A-1'}
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ingredient.expiryDate || '12/26'}
                </div>
            </CardFooter>
        </Card>
    )
}
