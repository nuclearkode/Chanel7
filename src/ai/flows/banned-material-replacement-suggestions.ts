'use server';
/**
 * @fileOverview This file contains the Genkit flow for suggesting replacement materials for banned ingredients.
 *
 * It includes:
 * - `suggestReplacementMaterials`: Function to trigger the AI suggestion flow.
 * - `ReplacementMaterialInput`: Input type definition for the flow.
 * - `ReplacementMaterialOutput`: Output type definition for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReplacementMaterialInputSchema = z.object({
  bannedMaterial: z
    .string()
    .describe('The name of the banned fragrance material.'),
  desiredScentProfile: z
    .string()
    .describe(
      'The desired scent profile to maintain (e.g., woody, floral, citrus).'
    ),
});
export type ReplacementMaterialInput = z.infer<typeof ReplacementMaterialInputSchema>;

const ReplacementMaterialOutputSchema = z.object({
  suggestedReplacements: z
    .array(z.string())
    .describe(
      'An array of fragrance material names that can be used as replacements.'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI’s reasoning for suggesting these replacements, considering both scent profile and regulatory compliance.'
    ),
});
export type ReplacementMaterialOutput = z.infer<typeof ReplacementMaterialOutputSchema>;

export async function suggestReplacementMaterials(
  input: ReplacementMaterialInput
): Promise<ReplacementMaterialOutput> {
  return bannedMaterialReplacementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bannedMaterialReplacementPrompt',
  input: {schema: ReplacementMaterialInputSchema},
  output: {schema: ReplacementMaterialOutputSchema},
  prompt: `You are an expert fragrance material advisor. A perfumer is seeking a replacement for a banned fragrance material, while maintaining a similar scent profile.

  Banned Material: {{{bannedMaterial}}}
  Desired Scent Profile: {{{desiredScentProfile}}}

  Suggest replacement materials, and provide a short explanation of why each material is a good replacement, taking into account both the scent profile and regulatory compliance.

  Format your response as a JSON object with "suggestedReplacements" (an array of material names) and "reasoning" (the explanation).
  `,
});

const bannedMaterialReplacementSuggestionsFlow = ai.defineFlow(
  {
    name: 'bannedMaterialReplacementSuggestionsFlow',
    inputSchema: ReplacementMaterialInputSchema,
    outputSchema: ReplacementMaterialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
