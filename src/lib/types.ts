export type OlfactiveFamily =
  | "Floral"
  | "Woody"
  | "Citrus"
  | "Fruity"
  | "Spicy"
  | "Green"
  | "Gourmand"
  | "Aquatic"
  | "Amber"
  | "Musky"
  | "Animalic"
  | "Earthy";

export type Note = "Top" | "Mid" | "Base";

export type Ingredient = {
  id: string;
  name: string;
  vendor: string;
  cost: number; // per gram
  note: Note;
  olfactiveFamilies: OlfactiveFamily[];
  isAllergen: boolean;
  ifraLimit: number; // percentage

  // New fields
  casNumber?: string;
  description?: string;

  // Legacy fields - made mandatory for compatibility
  concentration: number; // For inventory items: strength (usually 100). For formula ingredients: concentration in formula.
  dilution?: number;
};

export type FormulaItem = {
  ingredient: Ingredient;
  amount: number; // in grams
};

export type Evaluation = {
  id: string;
  date: string;
  dayOffset: number; // e.g. 0, 3, 7, 14, 28, 42
  rating: number; // 1-10
  notes: string;
  longevity?: number; // hours
  color?: string;
};

export type Formula = {
  id: string;
  name: string;

  // Legacy structure
  ingredients: Ingredient[];

  // New structure
  items?: FormulaItem[];
  solvent?: string;
  solventAmount?: number;
  targetTotal?: number;
  evaluations?: Evaluation[];
  createdAt?: string;
  updatedAt?: string;
};
