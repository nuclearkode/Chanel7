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
  imageUrl?: string;
  description?: string;
  longevity: number; // hours (duration on skin)
  impact: number; // 0-100 relative impact (strength)
  flashPoint?: number; // Celsius
  vaporPressure?: number; // mmHg
  smiles?: string; // SMILES string for molecular structure
  olfactoryProfile?: Record<string, number>; // Detailed profile (e.g., { Floral: 90, Spicy: 20 })

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

export type HistoryEntry = {
  id: string;
  date: string;
  user: string;
  action: string;
  details?: string;
};

// --- Visual Lab Types ---

export type ConnectionType = 'boost' | 'suppress' | 'blend';

export interface VisualConnection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
  strength: number; // 0-1
}

export interface VisualNodeMeta {
  id: string;
  ingredientId?: string; // Link to formula item (undefined for accord/output/utility nodes)
  type: 'ingredient' | 'accord' | 'output';
  position: { x: number; y: number };

  // Custom metadata for visualization
  label?: string;
  color?: string;
  description?: string;

  // For Accords/Groups
  children?: string[]; // IDs of child nodes
  collapsed?: boolean;
}

export interface VisualGroup {
  id: string;
  label: string;
  nodeIds: string[];
  color?: string;
}

export interface VisualLayout {
  nodes: VisualNodeMeta[];
  connections: VisualConnection[];
  groups: VisualGroup[];
}

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
  history?: HistoryEntry[];

  // Visual Editor State
  visualLayout?: VisualLayout;
};
