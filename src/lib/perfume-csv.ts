import 'server-only';
import fs from 'fs';
import path from 'path';
import { Perfume, PerfumeComposition, PerfumeHistory, PerfumeInspiration, PerfumePerformance, PerfumePyramid } from './encyclopedia-data';

// Singleton cache
let cachedPerfumes: Perfume[] | null = null;

const CSV_PATH = path.join(process.cwd(), 'public', 'data', 'fra_cleaned.csv');

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function loadPerfumes(): Promise<Perfume[]> {
  if (cachedPerfumes) return cachedPerfumes;

  try {
    const fileContent = await fs.promises.readFile(CSV_PATH, 'utf-8');
    const lines = fileContent.split('\n');

    // Skip header and empty lines
    const dataLines = lines.slice(1).filter(line => line.trim().length > 0);

    cachedPerfumes = dataLines.map((line, index) => {
      const cols = parseCSVLine(line);
      // Expected columns based on header:
      // 0: url
      // 1: Perfume (Name)
      // 2: Brand
      // 3: Country
      // 4: Gender
      // 5: Rating Value
      // 6: Rating Count
      // 7: Year
      // 8: Top Notes
      // 9: Middle Notes
      // 10: Base Notes
      // 11: Perfumer1
      // 12: Perfumer2
      // 13: mainaccord1
      // 14: mainaccord2
      // 15: mainaccord3
      // 16: mainaccord4
      // 17: mainaccord5

      const name = cols[1] || 'Unknown Perfume';
      const brand = cols[2] || 'Unknown Brand';
      const country = cols[3] || 'Unknown';
      const gender = cols[4] || 'Unisex';
      const ratingValue = parseFloat((cols[5] || '0').replace(',', '.'));
      const ratingCount = parseInt(cols[6] || '0', 10);
      const year = parseInt(cols[7] || '0', 10);

      const topNotes = (cols[8] || '').split(',').map(n => n.trim()).filter(Boolean);
      const middleNotes = (cols[9] || '').split(',').map(n => n.trim()).filter(Boolean);
      const baseNotes = (cols[10] || '').split(',').map(n => n.trim()).filter(Boolean);

      const perfumer1 = cols[11];
      const perfumer2 = cols[12];
      const nose = [perfumer1, perfumer2].filter(Boolean).join(', ') || 'N/A';

      const accords = [cols[13], cols[14], cols[15], cols[16], cols[17]].filter(Boolean);
      const family = accords[0] || 'Unknown';
      const tags = accords;

      // Map to Perfume interface
      const perfume: Perfume = {
        id: `fra-${index}`,
        name,
        brand,
        releaseYear: year || 0,
        image: '', // No image available
        concentration: 'N/A', // Not in CSV
        gender,
        family,
        description: `A ${gender} fragrance from ${brand}, released in ${year || 'unknown year'}. Origin: ${country}.`,
        tags,
        matchScore: Math.round((ratingValue / 5) * 100) || 0,
        analyst: 'Community',
        inspiration: {
          nose,
          muse: 'N/A',
          predecessor: 'N/A',
        },
        composition: [], // Missing in CSV
        pyramid: {
          top: { notes: topNotes, description: 'Top notes' },
          middle: { notes: middleNotes, description: 'Heart notes' },
          base: { notes: baseNotes, description: 'Base notes' },
          description: `Characterized by ${accords.slice(0, 3).join(', ')} notes.`,
        },
        performance: {
          sillage: 0, // Missing
          longevity: 0, // Missing
          description: `Community Rating: ${ratingValue}/5 based on ${ratingCount} votes.`,
        },
        history: [], // Missing
        trivia: [
          `Origin: ${country}`,
          `Rated by ${ratingCount} users on Fragrantica`,
          `Main Accords: ${accords.join(', ')}`
        ],
      };

      return perfume;
    });

    console.log(`Loaded ${cachedPerfumes.length} perfumes from CSV`);
    return cachedPerfumes;
  } catch (error) {
    console.error('Error loading perfumes CSV:', error);
    return [];
  }
}

export async function searchPerfumes(query: string, page: number = 1, limit: number = 20): Promise<{ perfumes: Perfume[], total: number }> {
  const allPerfumes = await loadPerfumes();

  let filtered = allPerfumes;
  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = allPerfumes.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.family.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    perfumes: filtered.slice(start, end),
    total: filtered.length
  };
}

export async function getPerfumeById(id: string): Promise<Perfume | undefined> {
  const allPerfumes = await loadPerfumes();
  return allPerfumes.find(p => p.id === id);
}
