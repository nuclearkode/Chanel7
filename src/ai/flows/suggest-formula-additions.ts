'use server';

/**
 * @fileOverview AI flow to suggest additional ingredients for a fragrance formula.
 *
 * - suggestFormulaAdditions - Suggests ingredients to add to the current formula.
 * - SuggestFormulaAdditionsInput - Input type.
 * - SuggestFormulaAdditionsOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFormulaAdditionsInputSchema = z.object({
  formulaItems: z.array(
    z.object({
      name: z.string().describe('Name of the ingredient currently in the formula.'),
      amount: z.number().describe('Amount of the ingredient in grams.'),
    })
  ).describe('List of ingredients currently in the formula.'),
  availableIngredients: z.array(z.string()).optional().describe('List of available ingredients in the inventory.'),
  targetProfile: z.string().optional().describe('Optional description of the desired scent profile.'),
});
export type SuggestFormulaAdditionsInput = z.infer<typeof SuggestFormulaAdditionsInputSchema>;

const SuggestFormulaAdditionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string().describe('Name of the suggested ingredient.'),
      note: z.enum(['Top', 'Heart', 'Base']).describe('The note classification of the suggested ingredient.'),
      reasoning: z.string().describe('Reasoning for why this ingredient would enhance the formula.'),
    })
  ).describe('List of suggested ingredients.'),
});
export type SuggestFormulaAdditionsOutput = z.infer<typeof SuggestFormulaAdditionsOutputSchema>;

export async function suggestFormulaAdditions(
  input: SuggestFormulaAdditionsInput
): Promise<SuggestFormulaAdditionsOutput> {
  return suggestFormulaAdditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFormulaAdditionsPrompt',
  input: {schema: SuggestFormulaAdditionsInputSchema},
  output: {schema: SuggestFormulaAdditionsOutputSchema},
  prompt: `You are an expert perfumer. Based on the current formula and target profile (if provided), suggest 3 ingredients that would enhance the fragrance.

  Current Formula:
  {{#each formulaItems}}
  - {{this.name}}: {{this.amount}}g
  {{/each}}

  {{#if availableIngredients}}
  Available Ingredients:
  {{#each availableIngredients}}
  - {{this}}
  {{/each}}
  Please prioritize suggestions from this list, but you may suggest others if they are perfect fits.
  {{/if}}

  {{#if targetProfile}}
  Target Profile: {{targetProfile}}
  {{/if}}

  Suggest ingredients that are chemically compatible and create a harmonious accord with the existing materials.
  Provide the ingredient name, its note classification (Top, Heart, or Base), and a brief reasoning.
  `,
});

const suggestFormulaAdditionsFlow = ai.defineFlow(
  {
    name: 'suggestFormulaAdditionsFlow',
    inputSchema: SuggestFormulaAdditionsInputSchema,
    outputSchema: SuggestFormulaAdditionsOutputSchema,
  },
  async input => {
    // If formula is empty, handle gracefully or rely on prompt to suggest general starters.
    if (input.formulaItems.length === 0 && !input.targetProfile) {
        // Fallback for empty formula without profile
        return {
            suggestions: [
                { name: 'Bergamot', note: 'Top', reasoning: 'A classic fresh start for any formula.' },
                { name: 'Hedione', note: 'Heart', reasoning: 'Adds transparency and lift.' },
                { name: 'Iso E Super', note: 'Base', reasoning: 'Provides a velvety woody background.' }
            ]
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
