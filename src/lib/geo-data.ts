
export interface GeoPoint {
  lat: number;
  lng: number;
  country: string;
  region: string;
  details?: string;
}

const ORIGIN_MAP: Record<string, GeoPoint> = {
  // Rose
  "rose": { lat: 42.7339, lng: 25.4858, country: "Bulgaria", region: "Rose Valley", details: "World's primary source of Rose Damascena." },
  "rosa": { lat: 42.7339, lng: 25.4858, country: "Bulgaria", region: "Rose Valley", details: "World's primary source of Rose Damascena." },

  // Jasmine
  "jasmine": { lat: 11.1271, lng: 78.6569, country: "India", region: "Tamil Nadu", details: "Major producer of Jasmine Sambac and Grandiflorum." },
  "jasmin": { lat: 11.1271, lng: 78.6569, country: "India", region: "Tamil Nadu", details: "Major producer of Jasmine Sambac and Grandiflorum." },

  // Vanilla
  "vanilla": { lat: -14.2875, lng: 50.1656, country: "Madagascar", region: "Sava", details: "Produces 80% of the world's vanilla." },
  "vanillin": { lat: -14.2875, lng: 50.1656, country: "Madagascar", region: "Sava", details: "Synthetic or derived, mapped to primary natural source for context." },

  // Sandalwood
  "sandalwood": { lat: 12.2958, lng: 76.6394, country: "India", region: "Mysore", details: "Historical source of Santalum Album." },
  "santal": { lat: 12.2958, lng: 76.6394, country: "India", region: "Mysore", details: "Historical source of Santalum Album." },

  // Citrus / Bergamot / Lemon
  "bergamot": { lat: 38.1157, lng: 15.6606, country: "Italy", region: "Calabria", details: "Exclusive region for high-quality Bergamot." },
  "lemon": { lat: 37.5990, lng: 14.0154, country: "Italy", region: "Sicily", details: "Famous for citrus groves." },
  "citrus": { lat: 37.5990, lng: 14.0154, country: "Italy", region: "Sicily", details: "Generic citrus mapping." },
  "orange": { lat: 28.5383, lng: -81.3792, country: "USA", region: "Florida", details: "Major producer of orange oils." },
  "neroli": { lat: 36.8065, lng: 10.1815, country: "Tunisia", region: "Nabeul", details: "Traditional center for orange blossom distillation." },

  // Vetiver
  "vetiver": { lat: 18.3228, lng: -72.2929, country: "Haiti", region: "Les Cayes", details: "Top producer of high-quality Vetiver oil." },

  // Patchouli
  "patchouli": { lat: 0.7893, lng: 113.9213, country: "Indonesia", region: "Sulawesi", details: "Primary global supplier of Patchouli." },

  // Lavender
  "lavender": { lat: 43.9493, lng: 4.8055, country: "France", region: "Provence", details: "Iconic lavender fields." },

  // Oud / Agarwood
  "oud": { lat: 12.5657, lng: 104.9910, country: "Cambodia", region: "Pursat", details: "Wild harvested Agarwood." },
  "agarwood": { lat: 12.5657, lng: 104.9910, country: "Cambodia", region: "Pursat", details: "Wild harvested Agarwood." },

  // Ylang Ylang
  "ylang": { lat: -12.8275, lng: 45.1662, country: "Comoros", region: "Anjouan", details: "Top exporter of Ylang Ylang oil." },

  // Frankincense
  "frankincense": { lat: 17.0151, lng: 54.0924, country: "Oman", region: "Dhofar", details: "Ancient source of Boswellia Sacra." },
  "olibanum": { lat: 17.0151, lng: 54.0924, country: "Oman", region: "Dhofar", details: "Ancient source of Boswellia Sacra." },

  // Iris / Orris
  "iris": { lat: 43.7696, lng: 11.2558, country: "Italy", region: "Tuscany", details: "Source of premium Orris butter." },
  "orris": { lat: 43.7696, lng: 11.2558, country: "Italy", region: "Tuscany", details: "Source of premium Orris butter." },

  // Generic / Solvents (Map to Hubs)
  "alcohol": { lat: 48.8566, lng: 2.3522, country: "France", region: "Paris", details: "Perfume blending hub." },
  "ethanol": { lat: 48.8566, lng: 2.3522, country: "France", region: "Paris", details: "Perfume blending hub." },
  "musk": { lat: 31.2304, lng: 121.4737, country: "China", region: "Shanghai", details: "Major synthetic musk production center." },
  "ambroxan": { lat: 31.2304, lng: 121.4737, country: "China", region: "Shanghai", details: "Synthetic production center." },
  "hedione": { lat: 46.2044, lng: 6.1432, country: "Switzerland", region: "Geneva", details: "Firmenich HQ (Originator)." },
  "iso e super": { lat: 40.7128, lng: -74.0060, country: "USA", region: "New York", details: "IFF HQ (Originator)." }
};

export function getIngredientOrigin(name: string): GeoPoint | null {
  const lowerName = name.toLowerCase();

  // Direct match check
  for (const key in ORIGIN_MAP) {
    if (lowerName.includes(key)) {
      return ORIGIN_MAP[key];
    }
  }

  return null;
}
