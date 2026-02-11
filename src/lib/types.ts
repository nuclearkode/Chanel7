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
  casNumber?: string;
  description?: string;
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
  items: FormulaItem[];
  solvent: string;
  solventAmount: number;
  targetTotal: number;
  evaluations?: Evaluation[];
  createdAt: string;
  updatedAt: string;
};
