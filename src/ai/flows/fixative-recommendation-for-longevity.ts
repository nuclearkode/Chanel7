'use server';

/**
 * @fileOverview An AI agent that suggests fixatives for extending the life of a scent.
 *
 * - suggestFixative - A function that suggests a fixative for extending the life of a scent.
 * - SuggestFixativeInput - The input type for the suggestFixative function.
 * - SuggestFixativeOutput - The return type for the suggestFixative function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFixativeInputSchema = z.object({
  scentProfile: z
    .string()
    .describe(
      'A description of the scent profile, including the top, middle, and base notes.'
    ),
  desiredLongevity: z
    .string()
    .describe('The desired longevity of the scent (e.g., "long-lasting", "moderate", "short").'),
});
export type SuggestFixativeInput = z.infer<typeof SuggestFixativeInputSchema>;

const SuggestFixativeOutputSchema = z.object({
  fixativeSuggestion: z
    .string()
    .describe(
      'A suggestion for a fixative that would help extend the life of the scent, including the reasoning for the suggestion.'
    ),
});
export type SuggestFixativeOutput = z.infer<typeof SuggestFixativeOutputSchema>;

export async function suggestFixative(input: SuggestFixativeInput): Promise<SuggestFixativeOutput> {
  return suggestFixativeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFixativePrompt',
  input: {schema: SuggestFixativeInputSchema},
  output: {schema: SuggestFixativeOutputSchema},
  prompt: `You are an expert perfumer specializing in fixatives and scent longevity.

You will use the scent profile and desired longevity to suggest a fixative that will extend the life of the scent.

Scent Profile: {{{scentProfile}}}
Desired Longevity: {{{desiredLongevity}}}

Suggest a fixative, including the reasoning for your suggestion:
`,
});

const suggestFixativeFlow = ai.defineFlow(
  {
    name: 'suggestFixativeFlow',
    inputSchema: SuggestFixativeInputSchema,
    outputSchema: SuggestFixativeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
