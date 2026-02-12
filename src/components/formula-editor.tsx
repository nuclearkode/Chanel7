"use client"

import React, { useCallback, useLayoutEffect, useRef } from 'react'
import {
  Accordion,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { type Formula, type Ingredient } from '@/lib/types'
import { IngredientRow } from './ingredient-row'

interface FormulaEditorProps {
  formula: Formula;
  onFormulaChange: (formula: Formula) => void;
}

export function FormulaEditor({ formula, onFormulaChange }: FormulaEditorProps) {
  // Use refs to keep handlers stable while accessing the latest state
  const formulaRef = useRef(formula);
  const onFormulaChangeRef = useRef(onFormulaChange);

  // Sync refs with props synchronously after render
  useLayoutEffect(() => {
    formulaRef.current = formula;
    onFormulaChangeRef.current = onFormulaChange;
  });

  const handleUpdateIngredient = useCallback((updatedIngredient: Ingredient) => {
    const currentFormula = formulaRef.current;
    const newIngredients = currentFormula.ingredients.map(ing => ing.id === updatedIngredient.id ? updatedIngredient : ing);
    onFormulaChangeRef.current({ ...currentFormula, ingredients: newIngredients });
  }, []);

  const handleDeleteIngredient = useCallback((ingredientId: string) => {
    const currentFormula = formulaRef.current;
    const newIngredients = currentFormula.ingredients.filter(ing => ing.id !== ingredientId);
    onFormulaChangeRef.current({ ...currentFormula, ingredients: newIngredients });
  }, []);

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
