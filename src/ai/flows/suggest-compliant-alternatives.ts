'use server';

/**
 * @fileOverview This file contains a Genkit flow that suggests compliant alternatives
 * for ingredients exceeding IFRA limits.
 *
 * - suggestCompliantAlternatives - The main function to suggest compliant alternatives.
 * - SuggestCompliantAlternativesInput - The input type for the suggestCompliantAlternatives function.
 * - SuggestCompliantAlternativesOutput - The output type for the suggestCompliantAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCompliantAlternativesInputSchema = z.object({
  ingredientName: z.string().describe('The name of the ingredient that exceeds the IFRA limit.'),
  ifraLimit: z.number().describe('The IFRA limit for the ingredient in the current category.'),
  currentConcentration: z.number().describe('The current concentration of the ingredient in the formula.'),
  category: z.string().describe('The product category for which IFRA limits apply.'),
});
export type SuggestCompliantAlternativesInput = z.infer<typeof SuggestCompliantAlternativesInputSchema>;

const SuggestCompliantAlternativesOutputSchema = z.object({
  alternatives: z.array(
    z.object({
      name: z.string().describe('Name of the alternative ingredient.'),
      safeConcentration: z.number().describe('The maximum safe concentration for the alternative ingredient based on IFRA limits.'),
      reasoning: z.string().describe('Reasoning why this ingredient is a suitable alternative.'),
    })
  ).describe('A list of compliant alternative ingredients.'),
});
export type SuggestCompliantAlternativesOutput = z.infer<typeof SuggestCompliantAlternativesOutputSchema>;

export async function suggestCompliantAlternatives(input: SuggestCompliantAlternativesInput): Promise<SuggestCompliantAlternativesOutput> {
  return suggestCompliantAlternativesFlow(input);
}

const suggestCompliantAlternativesPrompt = ai.definePrompt({
  name: 'suggestCompliantAlternativesPrompt',
  input: {schema: SuggestCompliantAlternativesInputSchema},
  output: {schema: SuggestCompliantAlternativesOutputSchema},
  prompt: `You are an expert fragrance formulator with deep knowledge of IFRA guidelines and ingredient properties.

  The user is formulating a fragrance and one of their ingredients, {{ingredientName}}, exceeds the IFRA limit of {{ifraLimit}} for the product category {{category}}. The current concentration of {{ingredientName}} is {{currentConcentration}}.

  Suggest a few alternative ingredients that would be compliant with IFRA regulations and maintain the desired scent profile.
  For each suggested alternative, provide the maximum safe concentration based on IFRA limits and explain why it's a suitable replacement.

  Ensure the output is well-formatted and easy to understand.  Focus on alternatives that are readily available and commonly used in perfumery.
  `,
});

const suggestCompliantAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestCompliantAlternativesFlow',
    inputSchema: SuggestCompliantAlternativesInputSchema,
    outputSchema: SuggestCompliantAlternativesOutputSchema,
  },
  async input => {
    const {output} = await suggestCompliantAlternativesPrompt(input);
    return output!;
  }
);
