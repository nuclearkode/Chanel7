'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting an accord (bridge) between two fragrance components.
 *
 * The flow takes two component names as input and returns a suggestion for an accord, including amounts and reasoning.
 *
 * @example
 * // Example usage:
 * const result = await suggestAccord({
 *   component1: 'Bergamot',
 *   component2: 'Sandalwood',
 * });
 *
 * // The result will contain a suggested accord (a combination of fragrance notes) between Bergamot and Sandalwood.
 *
 * @example
 * // Input:
 * type AccordSuggestionInput = {
 *   component1: string;
 *   component2: string;
 * };
 *
 * // Output:
 * type AccordSuggestionOutput = {
 *   accordSuggestion: string; // Suggested accord, including amounts and reasoning
 * };
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccordSuggestionInputSchema = z.object({
  component1: z
    .string()
    .describe('The name of the first fragrance component.'),
  component2: z
    .string()
    .describe('The name of the second fragrance component.'),
});
export type AccordSuggestionInput = z.infer<typeof AccordSuggestionInputSchema>;

const AccordSuggestionOutputSchema = z.object({
  accordSuggestion: z
    .string()
    .describe(
      'A suggestion for an accord between the two components, including amounts and reasoning.'
    ),
});
export type AccordSuggestionOutput = z.infer<typeof AccordSuggestionOutputSchema>;

export async function suggestAccord(
  input: AccordSuggestionInput
): Promise<AccordSuggestionOutput> {
  return accordSuggestionFlow(input);
}

const accordSuggestionPrompt = ai.definePrompt({
  name: 'accordSuggestionPrompt',
  input: {schema: AccordSuggestionInputSchema},
  output: {schema: AccordSuggestionOutputSchema},
  prompt: `You are an expert perfumer, skilled at creating harmonious accords between fragrance components.

  Given two fragrance components, suggest an accord (a bridge) between them, including specific amounts (in parts) and a brief reasoning for the suggestion. Be creative and generate only one accord.

  Component 1: {{{component1}}}
  Component 2: {{{component2}}}

  Accord Suggestion:`,
});

const accordSuggestionFlow = ai.defineFlow(
  {
    name: 'accordSuggestionFlow',
    inputSchema: AccordSuggestionInputSchema,
    outputSchema: AccordSuggestionOutputSchema,
  },
  async input => {
    const {output} = await accordSuggestionPrompt(input);
    return output!;
  }
);
