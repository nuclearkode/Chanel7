"use client"

import React from 'react'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import { type Ingredient, type Note } from '@/lib/types'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { notes } from '@/lib/data'

interface IngredientRowProps {
  ingredient: Ingredient
  onUpdate: (updatedIngredient: Ingredient) => void
  onDelete: (ingredientId: string) => void
}

export const IngredientRow = React.memo(({
  ingredient,
  onUpdate,
  onDelete,
}: IngredientRowProps) => {
  const isOverLimit = ingredient.concentration > ingredient.ifraLimit

  const handleFieldChange = (field: keyof Ingredient, value: string | number) => {
    onUpdate({ ...ingredient, [field]: value });
  };

  return (
    <AccordionItem value={ingredient.id}>
      <AccordionTrigger className="hover:bg-accent/50 rounded-md px-2 -mx-2">
        <div className="flex items-center gap-4 w-full">
          {isOverLimit && <AlertTriangle className="h-5 w-5 text-destructive" />}
          <span className="font-medium text-base flex-1 text-left">{ingredient.name}</span>
          <div className="flex items-center gap-4">
            <Badge variant={isOverLimit ? "destructive" : "secondary"} className="w-24 justify-center">
              {ingredient.concentration.toFixed(2)}%
            </Badge>
            <Badge variant="outline" className="w-24 justify-center hidden md:flex">{ingredient.note}</Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor={`concentration-${ingredient.id}`}>Concentration (%)</Label>
              <Input id={`concentration-${ingredient.id}`} type="number" value={ingredient.concentration} onChange={(e) => handleFieldChange('concentration', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`cost-${ingredient.id}`}>Cost/g ($)</Label>
              <Input id={`cost-${ingredient.id}`} type="number" value={ingredient.cost} onChange={(e) => handleFieldChange('cost', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`note-${ingredient.id}`}>Note</Label>
               <Select value={ingredient.note} onValueChange={(value) => handleFieldChange('note', value as Note)}>
                  <SelectTrigger id={`note-${ingredient.id}`}>
                    <SelectValue placeholder="Select note" />
                  </SelectTrigger>
                  <SelectContent>
                    {notes.map(note => <SelectItem key={note} value={note}>{note}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`vendor-${ingredient.id}`}>Vendor</Label>
              <Input id={`vendor-${ingredient.id}`} value={ingredient.vendor} onChange={(e) => handleFieldChange('vendor', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`dilution-${ingredient.id}`}>Dilution (%)</Label>
              <Input id={`dilution-${ingredient.id}`} type="number" value={ingredient.dilution} onChange={(e) => handleFieldChange('dilution', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`ifra-${ingredient.id}`}>IFRA Limit (%)</Label>
              <Input id={`ifra-${ingredient.id}`} type="number" value={ingredient.ifraLimit} onChange={(e) => handleFieldChange('ifraLimit', parseFloat(e.target.value) || 0)} className={isOverLimit ? "border-destructive focus-visible:ring-destructive" : ""} />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Olfactive Families</Label>
              <div className="flex flex-wrap gap-2">
                {ingredient.olfactiveFamilies.map(family => <Badge key={family} variant="secondary">{family}</Badge>)}
              </div>
            </div>
            <div className="flex justify-end items-center">
              <Button variant="ghost" size="icon" onClick={() => onDelete(ingredient.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Delete Ingredient</span>
              </Button>
            </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
});

IngredientRow.displayName = 'IngredientRow';
