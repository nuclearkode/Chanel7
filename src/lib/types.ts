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
  concentration: number; // percentage
  vendor: string;
  dilution: number; // percentage
  cost: number; // per gram
  note: Note;
  olfactiveFamilies: OlfactiveFamily[];
  isAllergen: boolean;
  ifraLimit: number; // percentage
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
  ingredients: Ingredient[];
  evaluations?: Evaluation[];
};
