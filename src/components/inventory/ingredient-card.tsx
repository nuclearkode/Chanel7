"use client"

import React from 'react'
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
                "group relative bg-card border rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col h-full",
                isSelected
                    ? "border-primary shadow-lg ring-1 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:shadow-md"
            )}
        >
            {ingredient.imageUrl && (
                <div className="w-full h-32 overflow-hidden relative">
                    <img
                        src={ingredient.imageUrl}
                        alt={ingredient.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <Badge variant="secondary" className={cn(
                        "absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wide border bg-background/80 backdrop-blur-sm",
                        ingredient.note === 'Top' && "text-yellow-500 border-yellow-500/20",
                        ingredient.note === 'Mid' && "text-pink-500 border-pink-500/20",
                        ingredient.note === 'Base' && "text-indigo-500 border-indigo-500/20",
                    )}>
                        {ingredient.note}
                    </Badge>
                </div>
            )}

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <div>
                        <h3 className={cn(
                            "text-lg font-bold transition-colors leading-tight",
                            isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                        )}>
                            {ingredient.name}
                        </h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mt-1">{ingredient.vendor}</p>
                    </div>

                    {!ingredient.imageUrl && (
                         <div className="flex flex-col gap-1 items-end">
                            <Badge variant="secondary" className={cn(
                                "text-[10px] font-bold uppercase tracking-wide border",
                                ingredient.note === 'Top' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                ingredient.note === 'Mid' && "bg-pink-500/10 text-pink-500 border-pink-500/20",
                                ingredient.note === 'Base' && "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
                            )}>
                                {ingredient.note}
                            </Badge>
                         </div>
                    )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed flex-grow">
                    {ingredient.description || "No description available."}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                     {ingredient.olfactiveFamilies.map(f => (
                        <span key={f} className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded border border-secondary">
                            {f}
                        </span>
                     ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                    <div className="font-mono text-xs text-muted-foreground">CAS: {ingredient.casNumber || "N/A"}</div>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd?.(e);
                        }}
                        className={cn(
                            "w-8 h-8 rounded flex items-center justify-center transition-colors",
                            isSelected
                                ? "text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                        )}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="sr-only">Add ingredient</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
