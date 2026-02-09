"use client"

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, PlusCircle, Trash2 } from "lucide-react"
import { type Formula, type Ingredient, type Note, type OlfactiveFamily } from '@/lib/types'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { notes, olfactiveFamilies } from '@/lib/data'

interface FormulaEditorProps {
  formula: Formula;
  onFormulaChange: (formula: Formula) => void;
}

const IngredientRow = ({
  ingredient,
  onUpdate,
  onDelete,
}: {
  ingredient: Ingredient
  onUpdate: (updatedIngredient: Ingredient) => void
  onDelete: (ingredientId: string) => void
}) => {
  const isOverLimit = ingredient.concentration > ingredient.ifraLimit
  const totalCost = (ingredient.concentration / 100) * 1000 * ingredient.cost // Assuming 1000g total for calculation

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
}

export function FormulaEditor({ formula, onFormulaChange }: FormulaEditorProps) {
  
  const handleUpdateIngredient = (updatedIngredient: Ingredient) => {
    const newIngredients = formula.ingredients.map(ing => ing.id === updatedIngredient.id ? updatedIngredient : ing);
    onFormulaChange({ ...formula, ingredients: newIngredients });
  };

  const handleAddIngredient = () => {
    const newId = (Math.max(...formula.ingredients.map(i => parseInt(i.id))) + 1).toString();
    const newIngredient: Ingredient = {
      id: newId,
      name: `New Ingredient ${newId}`,
      concentration: 0,
      vendor: "N/A",
      dilution: 100,
      cost: 0,
      note: "Mid",
      olfactiveFamilies: [],
      isAllergen: false,
      ifraLimit: 100,
    };
    onFormulaChange({ ...formula, ingredients: [...formula.ingredients, newIngredient] });
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    const newIngredients = formula.ingredients.filter(ing => ing.id !== ingredientId);
    onFormulaChange({ ...formula, ingredients: newIngredients });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">Formula Ingredients</CardTitle>
        <Button variant="outline" onClick={handleAddIngredient}>
          <PlusCircle className="mr-2" />
          Add Ingredient
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {formula.ingredients.map(ingredient => (
            <IngredientRow key={ingredient.id} ingredient={ingredient} onUpdate={handleUpdateIngredient} onDelete={handleDeleteIngredient} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
