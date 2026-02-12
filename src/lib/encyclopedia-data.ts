export interface PerfumeInspiration {
  nose: string;
  muse: string;
  predecessor: string;
}

export interface PerfumeComposition {
  name: string;
  percentage: number;
  description: string;
  color?: string;
  formula?: string;
}

export interface PerfumePyramid {
  top: { notes: string[]; description: string };
  middle: { notes: string[]; description: string };
  base: { notes: string[]; description: string };
  description: string;
}

export interface PerfumePerformance {
  sillage: number; // 0-10
  longevity: number; // 0-10
  description: string;
}

export interface PerfumeHistory {
  title: string;
  content: string;
  tags: string[];
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  releaseYear: number;
  image: string;
  concentration: string;
  gender: string;
  family: string;
  description: string;
  tags: string[];
  matchScore?: number;
  analyst?: string;
  inspiration: PerfumeInspiration;
  composition: PerfumeComposition[];
  pyramid: PerfumePyramid;
  performance: PerfumePerformance;
  history: PerfumeHistory[];
  trivia: string[];
}

export const perfumes: Perfume[] = [
  {
    id: "LB-33-2011",
    name: "Santal 33",
    brand: "Le Labo",
    releaseYear: 2011,
    image: "/images/encyclopedia/santal33.jpg", // Placeholder path
    concentration: "EdP",
    gender: "Unisex",
    family: "Woody Aromatic",
    description: "A defining scent of the 2010s, Santal 33 introduced a mass audience to the raw, rugged appeal of Australian Sandalwood paired with dry papyrus and leather.",
    tags: ["Woody", "Powdery", "Leather"],
    matchScore: 98,
    analyst: "Dr. A. Vance",
    inspiration: {
      nose: "Frank Voelkl",
      muse: "Marlboro Man Adverts",
      predecessor: "Santal 26 (Candle)",
    },
    composition: [
      {
        name: "Iso E Super",
        percentage: 40,
        description: "Synthetic woody amber molecule, velvet-like effect.",
        color: "bg-primary",
      },
      {
        name: "Aus. Sandalwood",
        percentage: 25,
        description: "Santalum spicatum oil.",
        color: "bg-primary/70",
      },
      {
        name: "Cardamom",
        percentage: 12,
        description: "Spicy, fresh top note.",
        color: "bg-primary/50",
      },
      {
        name: "Leather Accord",
        percentage: 10,
        description: "Birch tar and labdanum based.",
        color: "bg-primary/40",
      },
    ],
    pyramid: {
      top: { notes: ["Cardamom", "Iris"], description: "Fresh spice & air" },
      middle: { notes: ["Violet", "Ambros"], description: "Floral heartbeat" },
      base: { notes: ["Sandalwood", "Cedar", "Leather"], description: "Raw timber & hide" },
      description: "A linear structure with deep woody persistence",
    },
    performance: {
      sillage: 9, // Room-Filling
      longevity: 9, // Eternal
      description: "\"Nuclear projection with 12+ hours longevity.\"",
    },
    history: [
      {
        title: "The \"Santal\" Phenomenon",
        content: "Prior to 2011, sandalwood was largely relegated to base notes in oriental compositions or barbershop fougères. Santal 33 brought the raw ingredient to the forefront, overdosing it to create a \"sawdust\" texture that became ubiquitous in New York City and Los Angeles boutiques, eventually being dubbed \"the scent you smell everywhere.\"",
        tags: ["NY Times Feature", "Cult Classic"],
      },
    ],
    trivia: [
      "Originally developed as a candle scent (Santal 26) for the Gramercy Park Hotel.",
      "Contains Australian Sandalwood (Santalum spicatum) instead of the endangered Indian Mysore variety.",
      "Often compared to \"dill pickles\" by critics sensitive to certain sandalwood aroma chemicals.",
    ],
  },
  {
    id: "MFK-540-2015",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    releaseYear: 2015,
    image: "/images/encyclopedia/baccarat540.jpg", // Placeholder path
    concentration: "Ext",
    gender: "Unisex",
    family: "Amber Floral",
    description: "Luminous and sophisticated, Baccarat Rouge 540 lays on the skin like an amber, floral and woody breeze. A poetic alchemy. A graphic and highly condensed signature.",
    tags: ["Amber", "Floral", "Spicy"],
    matchScore: 85,
    analyst: "Dr. A. Vance",
    inspiration: {
      nose: "Francis Kurkdjian",
      muse: "Baccarat Crystal",
      predecessor: "Rouge 540 (Limited Ed.)",
    },
    composition: [
      {
        name: "Ethyl Maltol",
        percentage: 35,
        description: "Sweet, spun-sugar effect.",
        color: "bg-red-500",
      },
      {
        name: "Ambroxan",
        percentage: 30,
        description: "Ambery, musky diffusion.",
        color: "bg-amber-400",
      },
      {
        name: "Hedione",
        percentage: 20,
        description: "Transparent floral freshness.",
        color: "bg-blue-300",
      },
      {
        name: "Saffron",
        percentage: 5,
        description: "Spicy, leathery nuance.",
        color: "bg-red-700",
      },
    ],
    pyramid: {
      top: { notes: ["Saffron", "Jasmine"], description: "Radiant spice" },
      middle: { notes: ["Amberwood", "Ambergris"], description: "Mineral heart" },
      base: { notes: ["Fir Resin", "Cedar"], description: "Woody depth" },
      description: "An airy, diffusive structure that oscillates between sweet and salty.",
    },
    performance: {
      sillage: 10,
      longevity: 10,
      description: "Airy but incredibly persistent, creates a massive scent trail.",
    },
    history: [
      {
        title: "A Crystal Anniversary",
        content: "Created to celebrate Baccarat's 250th anniversary. The name 540 refers to the temperature (540°C) required to achieve the red color in Baccarat crystal.",
        tags: ["Anniversary Edition", "Luxury"],
      },
    ],
    trivia: [
      "Uses a massive overdose of Ethyl Maltol (sugar note) balanced by Ambroxan.",
      "Known for causing olfactory fatigue (anosmia) due to its high molecular weight ingredients.",
      "One of the most duped fragrances in modern history.",
    ],
  },
];
