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

export type Formula = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};
