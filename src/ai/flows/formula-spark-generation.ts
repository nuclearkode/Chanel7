'use server';

/**
 * @fileOverview AI-driven formula spark generation for perfumers.
 *
 * - generateFormulaSpark - A function that generates randomized but chemically informed starting formulas.
 * - FormulaSparkInput - The input type for the generateFormulaSpark function.
 * - FormulaSparkOutput - The return type for the generateFormulaSpark function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormulaSparkInputSchema = z.object({
  olfactoryProfile: z.string().describe('The desired olfactory profile of the formula (e.g., floral, woody, oriental).'),
  complexity: z.enum(['simple', 'moderate', 'complex']).describe('The desired complexity of the formula.'),
  inspiration: z.string().optional().describe('Optional inspiration for the formula (e.g., a specific perfume, a feeling, a place).'),
});
export type FormulaSparkInput = z.infer<typeof FormulaSparkInputSchema>;

const FormulaSparkOutputSchema = z.object({
  formula: z.record(z.number()).describe('A map of chemical names to their amount in grams.'),
  notes: z.string().describe('Notes from the AI about the chemical compatibility of the formula.'),
});
export type FormulaSparkOutput = z.infer<typeof FormulaSparkOutputSchema>;

export async function generateFormulaSpark(input: FormulaSparkInput): Promise<FormulaSparkOutput> {
  return formulaSparkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formulaSparkPrompt',
  input: {schema: FormulaSparkInputSchema},
  output: {schema: FormulaSparkOutputSchema},
  prompt: `You are an expert perfumer, specialized in creating inspiring starting formulas.

  Generate a randomized but chemically informed starting formula, using grams and chemical names, to inspire perfumers creations.
  The formula should align with the desired olfactory profile and complexity, taking inspiration if provided into account.

  Olfactory Profile: {{{olfactoryProfile}}}
  Complexity: {{{complexity}}}
  Inspiration: {{{inspiration}}}

  Output a JSON object containing the formula (a map of chemical names to their amount in grams) and any relevant notes about chemical compatibility.
  `,
});

const formulaSparkFlow = ai.defineFlow(
  {
    name: 'formulaSparkFlow',
    inputSchema: FormulaSparkInputSchema,
    outputSchema: FormulaSparkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
