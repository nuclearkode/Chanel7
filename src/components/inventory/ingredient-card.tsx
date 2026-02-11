"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { type Ingredient } from '@/lib/types'
import { cn } from '@/lib/utils'

interface IngredientCardProps {
    ingredient: Ingredient
    isSelected?: boolean
    onClick?: () => void
    onAdd?: (e: React.MouseEvent) => void
}

export function IngredientCard({ ingredient, isSelected, onClick, onAdd }: IngredientCardProps) {
    const isRestricted = ingredient.ifraLimit < 100

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative bg-card border rounded-xl p-4 cursor-pointer transition-all",
                isSelected
                    ? "border-primary shadow-lg ring-1 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:shadow-md"
            )}
        >
            <div className="flex justify-between items-start mb-3 gap-2">
                <div>
                    <h3 className={cn(
                        "text-lg font-bold transition-colors leading-tight",
                        isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                    )}>
                        {ingredient.name}
                    </h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mt-1">{ingredient.vendor}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                    <Badge variant="secondary" className={cn(
                        "text-[10px] font-bold uppercase tracking-wide border",
                        ingredient.note === 'Top' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                        ingredient.note === 'Mid' && "bg-pink-500/10 text-pink-500 border-pink-500/20",
                        ingredient.note === 'Base' && "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
                    )}>
                        {ingredient.note}
                    </Badge>
                    <Badge variant="secondary" className={cn(
                        "text-[10px] font-bold uppercase tracking-wide border",
                        !isRestricted ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    )}>
                        {isRestricted ? "Restricted" : "IFRA OK"}
                    </Badge>
                </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10 leading-relaxed">
                {ingredient.description || "No description available."}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="font-mono text-xs text-muted-foreground">CAS: {ingredient.casNumber || "N/A"}</div>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onAdd}
                    className={cn(
                        "w-8 h-8 rounded flex items-center justify-center transition-colors",
                        isSelected
                            ? "text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    )}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
