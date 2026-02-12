'use server';

import { searchPerfumes, getPerfumeById } from '@/lib/perfume-csv';
import { Perfume } from '@/lib/encyclopedia-data';

export async function searchPerfumesAction(query: string, page: number = 1): Promise<{ perfumes: Perfume[], total: number }> {
  try {
    return await searchPerfumes(query, page);
  } catch (error) {
    console.error('Failed to search perfumes:', error);
    return { perfumes: [], total: 0 };
  }
}

export async function getPerfumeAction(id: string): Promise<Perfume | undefined> {
    try {
        return await getPerfumeById(id);
    } catch (error) {
        console.error('Failed to get perfume:', error);
        return undefined;
    }
}
