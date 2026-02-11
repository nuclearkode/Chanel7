"use client"

import React, { createContext, useContext, useReducer } from "react"
import { type Ingredient, type Formula, type FormulaItem } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// --- Mock Data ---

const INITIAL_INVENTORY: Ingredient[] = [
  {
    id: "ing-1",
    name: "Iso E Super",
    vendor: "IFF",
    cost: 0.12,
    note: "Base",
    olfactiveFamilies: ["Woody", "Amber"],
    isAllergen: false,
    ifraLimit: 20,
    casNumber: "54464-57-2",
    description: "Velvety, woody, dry amber note. Provides fullness and subtle strength.",
    concentration: 100,
  },
  {
    id: "ing-2",
    name: "Hedione HC",
    vendor: "Firmenich",
    cost: 0.08,
    note: "Mid",
    olfactiveFamilies: ["Floral", "Citrus"],
    isAllergen: false,
    ifraLimit: 100,
    casNumber: "24851-98-7",
    description: "Transparent floral, jasmine-like, citrusy. Adds radiance and volume.",
    concentration: 100,
  },
  {
    id: "ing-3",
    name: "Bergamot Oil Reggio",
    vendor: "Capua 1880",
    cost: 0.65,
    note: "Top",
    olfactiveFamilies: ["Citrus", "Floral"],
    isAllergen: true,
    ifraLimit: 0.4,
    casNumber: "8007-75-8",
    description: "Fresh, zesty, sparkling citrus note with a distinct floral-peppery undertone.",
    concentration: 100,
  },
  {
    id: "ing-4",
    name: "Ambroxan",
    vendor: "Kao",
    cost: 0.85,
    note: "Base",
    olfactiveFamilies: ["Amber", "Musky"],
    isAllergen: false,
    ifraLimit: 100,
    casNumber: "6790-58-5",
    description: "Extremely powerful, ambergris-like, woody-amber note with dry, musky facets.",
    concentration: 100,
  },
  {
    id: "ing-5",
    name: "Rose Absolute",
    vendor: "Robertet",
    cost: 4.50,
    note: "Mid",
    olfactiveFamilies: ["Floral", "Spicy"],
    isAllergen: true,
    ifraLimit: 0.1,
    casNumber: "8007-01-0",
    description: "Deep, rich, spicy, honey-like rose. Classic floral heart for fine fragrance.",
    concentration: 100,
  },
  {
    id: "ing-6",
    name: "Linalool",
    vendor: "BASF",
    cost: 0.05,
    note: "Top",
    olfactiveFamilies: ["Floral", "Woody"],
    isAllergen: true,
    ifraLimit: 100,
    casNumber: "78-70-6",
    description: "Floral, fresh, lavender-like, woody. A key building block for floral accords.",
    concentration: 100,
  },
  {
    id: "ing-7",
    name: "Vetiver Haiti",
    vendor: "IFF",
    cost: 1.20,
    note: "Base",
    olfactiveFamilies: ["Woody", "Earthy"],
    isAllergen: false,
    ifraLimit: 100,
    casNumber: "8016-96-4",
    description: "Smoky, woody, earthy, rooty. Essential for masculine and woody fragrances.",
    concentration: 100,
  },
  {
    id: "ing-8",
    name: "Mandarin Red",
    vendor: "Naturals",
    cost: 0.40,
    note: "Top",
    olfactiveFamilies: ["Citrus", "Fruity"],
    isAllergen: true,
    ifraLimit: 100,
    casNumber: "8008-31-9",
    description: "Sweet, juicy, tangy citrus note. Adds brightness and joy.",
    concentration: 100,
  },
  {
    id: "ing-9",
    name: "Lavender Abs.",
    vendor: "Naturals",
    cost: 2.10,
    note: "Mid",
    olfactiveFamilies: ["Floral", "Green"],
    isAllergen: true,
    ifraLimit: 100,
    casNumber: "8000-28-0",
    description: "Rich, floral, herbaceous, sweet. The heart of fougères.",
    concentration: 100,
  },
    {
    id: "ing-10",
    name: "Galaxolide",
    vendor: "IFF",
    cost: 0.04,
    note: "Base",
    olfactiveFamilies: ["Musky", "Floral"],
    isAllergen: false,
    ifraLimit: 100,
    casNumber: "1222-05-5",
    description: "Clean, sweet, musky, floral. Very long lasting and substantive.",
    concentration: 100,
  },
  {
    id: "ing-11",
    name: "Jasmine Absolute",
    vendor: "Givaudan",
    cost: 15.5,
    note: "Mid",
    olfactiveFamilies: ["Floral", "Animalic"],
    isAllergen: true,
    ifraLimit: 0.7,
    casNumber: "8022-96-6",
    description: "Intense, warm, rich, floral, tea-like with spicy and fruity undertones.",
    concentration: 100,
  },
  {
    id: "ing-12",
    name: "Sandalwood Oil",
    vendor: "Perfumer's World",
    cost: 2.5,
    note: "Base",
    olfactiveFamilies: ["Woody"],
    isAllergen: false,
    ifraLimit: 15.0,
    casNumber: "8006-87-9",
    description: "Soft, sweet-woody, balsamic, tenacious, consistent.",
    concentration: 100,
  },
  {
    id: "ing-13",
    name: "Patchouli Oil",
    vendor: "IFF",
    cost: 0.9,
    note: "Base",
    olfactiveFamilies: ["Earthy", "Woody"],
    isAllergen: false,
    ifraLimit: 100,
    casNumber: "8014-09-3",
    description: "Rich, sweet-herbaceous, aromatic, spicy and woody-balsamic.",
    concentration: 100,
  },
  {
    id: "ing-14",
    name: "Clove Bud Oil",
    vendor: "Symrise",
    cost: 2.1,
    note: "Mid",
    olfactiveFamilies: ["Spicy"],
    isAllergen: true,
    ifraLimit: 0.5,
    casNumber: "8000-34-8",
    description: "Warm, strong, spicy, phenolic, sweet-woody.",
    concentration: 100,
  },
  {
    id: "ing-15",
    name: "Calone 1951",
    vendor: "Perfumer's Apprentice",
    cost: 3,
    note: "Top",
    olfactiveFamilies: ["Aquatic"],
    isAllergen: false,
    ifraLimit: 100,
    casNumber: "28940-11-6",
    description: "The classic marine note. Sea breeze, oyster, watermelon.",
    concentration: 100,
  },
  {
    id: "ing-16",
    name: "Galbanum Res.",
    vendor: "Givaudan",
    cost: 7,
    note: "Top",
    olfactiveFamilies: ["Green"],
    isAllergen: false,
    ifraLimit: 0.5,
    casNumber: "8023-91-4",
    description: "Intensely green, bitter, leafy, peppery, woody-balsamic.",
    concentration: 100,
  },
];

const syncIngredients = (items: FormulaItem[], targetTotal: number): Ingredient[] => {
  return items.map(item => ({
    ...item.ingredient,
    concentration: targetTotal > 0 ? (item.amount / targetTotal) * 100 : 0
  }))
}

const initialItems: FormulaItem[] = [
    { ingredient: INITIAL_INVENTORY[0], amount: 12.00 }, // Iso E Super
    { ingredient: INITIAL_INVENTORY[1], amount: 4.50 },  // Hedione
    { ingredient: INITIAL_INVENTORY[2], amount: 2.80 },  // Bergamot
    { ingredient: INITIAL_INVENTORY[3], amount: 0.70 },  // Ambroxan
]

const INITIAL_FORMULA: Formula = {
  id: "formula-1",
  name: "Bergamot & Cedar Study #4",
  items: initialItems,
  ingredients: syncIngredients(initialItems, 100.00),
  solvent: "Perfumer's Alcohol (SDA 40B)",
  solventAmount: 80.00,
  targetTotal: 100.00,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// --- Context & Reducer ---

type State = {
  inventory: Ingredient[]
  formulas: Formula[]
  activeFormula: Formula
}

type Action =
  | { type: "ADD_TO_FORMULA"; payload: Ingredient }
  | { type: "REMOVE_FROM_FORMULA"; payload: string } // ingredientId
  | { type: "UPDATE_QUANTITY"; payload: { ingredientId: string; amount: number } }
  | { type: "SET_SOLVENT"; payload: { solvent: string; amount: number } }
  | { type: "SET_FORMULA_NAME"; payload: string }
  | { type: "SET_TARGET_TOTAL"; payload: number }
  | { type: "SAVE_FORMULA" }
  | { type: "LOAD_FORMULA"; payload: string } // formulaId
  | { type: "CLEAR_FORMULA" }

const initialState: State = {
  inventory: INITIAL_INVENTORY,
  formulas: [INITIAL_FORMULA],
  activeFormula: INITIAL_FORMULA,
}

function perfumeReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TO_FORMULA": {
      const currentItems = state.activeFormula.items || []
      const exists = currentItems.some(item => item.ingredient.id === action.payload.id)
      if (exists) return state

      const newItems = [...currentItems, { ingredient: action.payload, amount: 0 }]
      const newIngredients = syncIngredients(newItems, state.activeFormula.targetTotal || 100)

      return {
        ...state,
        activeFormula: {
          ...state.activeFormula,
          items: newItems,
          ingredients: newIngredients,
          updatedAt: new Date().toISOString(),
        }
      }
    }
    case "REMOVE_FROM_FORMULA": {
      const currentItems = state.activeFormula.items || []
      const newItems = currentItems.filter(item => item.ingredient.id !== action.payload)
      const newIngredients = syncIngredients(newItems, state.activeFormula.targetTotal || 100)

      return {
        ...state,
        activeFormula: {
          ...state.activeFormula,
          items: newItems,
          ingredients: newIngredients,
          updatedAt: new Date().toISOString(),
        }
      }
    }
    case "UPDATE_QUANTITY": {
      const currentItems = state.activeFormula.items || []
      const newItems = currentItems.map(item =>
        item.ingredient.id === action.payload.ingredientId
          ? { ...item, amount: action.payload.amount }
          : item
      )
      const newIngredients = syncIngredients(newItems, state.activeFormula.targetTotal || 100)

      return {
        ...state,
        activeFormula: {
          ...state.activeFormula,
          items: newItems,
          ingredients: newIngredients,
          updatedAt: new Date().toISOString(),
        }
      }
    }
    case "SET_SOLVENT": {
      return {
        ...state,
        activeFormula: {
          ...state.activeFormula,
          solvent: action.payload.solvent,
          solventAmount: action.payload.amount,
          updatedAt: new Date().toISOString(),
        }
      }
    }
    case "SET_FORMULA_NAME": {
      return {
        ...state,
        activeFormula: {
          ...state.activeFormula,
          name: action.payload,
          updatedAt: new Date().toISOString(),
        }
      }
    }
    case "SET_TARGET_TOTAL": {
      const currentItems = state.activeFormula.items || []
      const newIngredients = syncIngredients(currentItems, action.payload)
      return {
        ...state,
        activeFormula: {
          ...state.activeFormula,
          targetTotal: action.payload,
          ingredients: newIngredients,
          updatedAt: new Date().toISOString(),
        }
      }
    }
    case "SAVE_FORMULA": {
      const exists = state.formulas.find(f => f.id === state.activeFormula.id)
      let newFormulas
      if (exists) {
        newFormulas = state.formulas.map(f => f.id === state.activeFormula.id ? state.activeFormula : f)
      } else {
        newFormulas = [...state.formulas, { ...state.activeFormula, id: uuidv4() }]
      }
      return {
        ...state,
        formulas: newFormulas,
      }
    }
    case "LOAD_FORMULA": {
      const formula = state.formulas.find(f => f.id === action.payload)
      if (!formula) return state
      return {
        ...state,
        activeFormula: formula,
      }
    }
    case "CLEAR_FORMULA": {
      return {
        ...state,
        activeFormula: {
          id: uuidv4(),
          name: "Untitled Formula",
          items: [],
          ingredients: [],
          solvent: "Perfumer's Alcohol (SDA 40B)",
          solventAmount: 80,
          targetTotal: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    }
    default:
      return state
  }
}

const PerfumeContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null,
})

export function PerfumeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(perfumeReducer, initialState)

  return (
    <PerfumeContext.Provider value={{ state, dispatch }}>
      {children}
    </PerfumeContext.Provider>
  )
}

export function usePerfume() {
  const context = useContext(PerfumeContext)
  if (!context) {
    throw new Error("usePerfume must be used within a PerfumeProvider")
  }
  return context
}
