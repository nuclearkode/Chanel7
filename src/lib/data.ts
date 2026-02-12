import { type Formula, type Ingredient, type Note, type OlfactiveFamily } from "@/lib/types";

export const initialIngredients: Ingredient[] = [
  {
    id: "1",
    name: "Bergamot",
    concentration: 15.0,
    vendor: "Perfumer's Apprentice",
    dilution: 100,
    cost: 0.12,
    note: "Top",
    olfactiveFamilies: ["Citrus", "Fruity"],
    isAllergen: true,
    ifraLimit: 20.0,
    longevity: 6,
    impact: 70,
    casNumber: "8007-75-8",
    description: "Fresh, citrusy, zesty, slightly floral and spicy."
  },
  {
    id: "2",
    name: "Jasmine Absolute",
    concentration: 2.5,
    vendor: "Givaudan",
    dilution: 10,
    cost: 15.5,
    note: "Mid",
    olfactiveFamilies: ["Floral", "Animalic"],
    isAllergen: true,
    ifraLimit: 0.7,
    longevity: 240,
    impact: 90,
    casNumber: "8022-96-6",
    description: "Intense floral, rich, sweet, tenacious, animalic undertones."
  },
  {
    id: "3",
    name: "Rose Otto",
    concentration: 11.0,
    vendor: "Firmenich",
    dilution: 100,
    cost: 12.0,
    note: "Mid",
    olfactiveFamilies: ["Floral", "Spicy"],
    isAllergen: true,
    ifraLimit: 1.25,
    longevity: 160,
    impact: 85,
    casNumber: "8007-01-0",
    description: "Deep, warm, rich, spicy-floral, honey-like."
  },
  {
    id: "4",
    name: "Sandalwood",
    concentration: 8.0,
    vendor: "Perfumer's World",
    dilution: 100,
    cost: 2.5,
    note: "Base",
    olfactiveFamilies: ["Woody"],
    isAllergen: false,
    ifraLimit: 15.0,
    longevity: 400,
    impact: 50,
    casNumber: "8006-87-9",
    description: "Creamy, soft, woody, sweet, tenacious."
  },
  {
    id: "5",
    name: "Vetiver",
    concentration: 6.0,
    vendor: "Symrise",
    dilution: 100,
    cost: 0.8,
    note: "Base",
    olfactiveFamilies: ["Woody", "Earthy"],
    isAllergen: false,
    ifraLimit: 15.0,
    longevity: 360,
    impact: 60,
    casNumber: "8016-96-4",
    description: "Earthy, woody, rooty, smoky, slightly sweet."
  },
  {
    id: "6",
    name: "Iso E Super",
    concentration: 22.5,
    vendor: "IFF",
    dilution: 100,
    cost: 0.05,
    note: "Base",
    olfactiveFamilies: ["Woody", "Amber"],
    isAllergen: false,
    ifraLimit: 25.0,
    longevity: 400,
    impact: 30,
    casNumber: "54464-57-2",
    description: "Transparent, woody, amber-like, velvety."
  },
  {
    id: "7",
    name: "Ethanol",
    concentration: 35.0,
    vendor: "Lab Solvent",
    dilution: 100,
    cost: 0.01,
    note: "Top",
    olfactiveFamilies: [],
    isAllergen: false,
    ifraLimit: 100,
    longevity: 1,
    impact: 0,
    casNumber: "64-17-5",
    description: "Solvent."
  },
];

export const initialFormula: Formula = {
  id: "f-01",
  name: "Ethereal Bloom",
  ingredients: initialIngredients,
};

const formula2: Formula = {
  id: "f-02",
  name: "Crimson Dusk",
  ingredients: [
    { id: "8", name: "Blood Orange", concentration: 20, vendor: "Givaudan", dilution: 100, cost: 0.15, note: "Top", olfactiveFamilies: ["Citrus"], isAllergen: true, ifraLimit: 12.5, longevity: 4, impact: 60, casNumber: "8028-48-6" },
    { id: "9", name: "Patchouli", concentration: 10, vendor: "IFF", dilution: 100, cost: 0.9, note: "Base", olfactiveFamilies: ["Earthy", "Woody"], isAllergen: false, ifraLimit: 100, longevity: 400, impact: 80, casNumber: "8014-09-3" },
    { id: "10", name: "Clove Bud", concentration: 1, vendor: "Symrise", dilution: 10, cost: 2.1, note: "Mid", olfactiveFamilies: ["Spicy"], isAllergen: true, ifraLimit: 0.5, longevity: 100, impact: 90, casNumber: "8000-34-8" },
    { id: "11", name: "Labdanum", concentration: 5, vendor: "Firmenich", dilution: 50, cost: 4, note: "Base", olfactiveFamilies: ["Amber", "Animalic"], isAllergen: false, ifraLimit: 100, longevity: 400, impact: 70, casNumber: "8016-26-0" },
    { id: "6", name: "Iso E Super", concentration: 24, vendor: "IFF", dilution: 100, cost: 0.05, note: "Base", olfactiveFamilies: ["Woody", "Amber"], isAllergen: false, ifraLimit: 25.0, longevity: 400, impact: 30, casNumber: "54464-57-2" },
    { id: "7", name: "Ethanol", concentration: 40, vendor: "Lab Solvent", dilution: 100, cost: 0.01, note: "Top", olfactiveFamilies: [], isAllergen: false, ifraLimit: 100, longevity: 1, impact: 0, casNumber: "64-17-5" },
  ]
};

const formula3: Formula = {
  id: "f-03",
  name: "Oceanic Verde",
  ingredients: [
    { id: "12", name: "Calone", concentration: 0.5, vendor: "Perfumer's Apprentice", dilution: 10, cost: 3, note: "Top", olfactiveFamilies: ["Aquatic"], isAllergen: false, ifraLimit: 100, longevity: 168, impact: 95, casNumber: "28940-11-6" },
    { id: "13", name: "Galbanum", concentration: 2, vendor: "Givaudan", dilution: 100, cost: 7, note: "Top", olfactiveFamilies: ["Green"], isAllergen: false, ifraLimit: 0.5, longevity: 24, impact: 100, casNumber: "8023-91-4" },
    { id: "14", name: "Ambroxan", concentration: 12.5, vendor: "Firmenich", dilution: 100, cost: 0.5, note: "Base", olfactiveFamilies: ["Amber", "Woody"], isAllergen: false, ifraLimit: 100, longevity: 400, impact: 40, casNumber: "6790-58-5" },
    { id: "5", name: "Vetiver", concentration: 10, vendor: "Symrise", dilution: 100, cost: 0.8, note: "Base", olfactiveFamilies: ["Woody", "Earthy"], isAllergen: false, ifraLimit: 15.0, longevity: 360, impact: 60, casNumber: "8016-96-4" },
    { id: "1", name: "Bergamot", concentration: 10, vendor: "Perfumer's Apprentice", dilution: 100, cost: 0.12, note: "Top", olfactiveFamilies: ["Citrus", "Fruity"], isAllergen: true, ifraLimit: 20.0, longevity: 6, impact: 70, casNumber: "8007-75-8" },
    { id: "7", name: "Ethanol", concentration: 65, vendor: "Lab Solvent", dilution: 100, cost: 0.01, note: "Top", olfactiveFamilies: [], isAllergen: false, ifraLimit: 100, longevity: 1, impact: 0, casNumber: "64-17-5" },
  ]
};

export const allFormulas: Formula[] = [initialFormula, formula2, formula3];


export const olfactiveFamilies: OlfactiveFamily[] = [
  "Floral",
  "Woody",
  "Citrus",
  "Fruity",
  "Spicy",
  "Green",
  "Gourmand",
  "Aquatic",
  "Amber",
  "Musky",
  "Animalic",
  "Earthy",
];

export const notes: Note[] = ["Top", "Mid", "Base"];

export const dummyIngredients: Ingredient[] = Array.from(
  new Map(allFormulas.flatMap(f => f.ingredients).map(i => [i.name, i])).values()
).sort((a, b) => a.name.localeCompare(b.name));
