"use client"

import React, { useCallback, useLayoutEffect, useRef } from 'react'
import {
  Accordion,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Formula, type Ingredient } from '@/lib/types'
import { IngredientRow } from './ingredient-row'
import { FormulaHistory } from './formula-history'
import { IngredientBrowser } from './ingredient-browser'

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

  const handleAddIngredient = useCallback((ingredient: Ingredient) => {
    const currentFormula = formulaRef.current;
    if (currentFormula.ingredients.some(i => i.id === ingredient.id)) {
      // Ingredient already exists.
      return;
    }

    const newIngredient: Ingredient = {
      ...ingredient,
      concentration: 0,
    };
    onFormulaChangeRef.current({ ...currentFormula, ingredients: [...currentFormula.ingredients, newIngredient] });
  }, []);
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="ingredients" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="ingredients" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-2xl">Formula Ingredients</CardTitle>
              <IngredientBrowser onAdd={handleAddIngredient} />
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {formula.ingredients.map(ingredient => (
                  <IngredientRow key={ingredient.id} ingredient={ingredient} onUpdate={handleUpdateIngredient} onDelete={handleDeleteIngredient} />
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <FormulaHistory history={formula.history} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
