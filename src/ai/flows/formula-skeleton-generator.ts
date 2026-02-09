'use server';

/**
 * @fileOverview An AI agent that generates a base formula structure with constraints.
 *
 * - generateFormulaSkeleton - A function that generates a base formula structure.
 * - FormulaSkeletonInput - The input type for the generateFormulaSkeleton function.
 * - FormulaSkeletonOutput - The return type for the generateFormulaSkeleton function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormulaSkeletonInputSchema = z.object({
  constraints: z
    .string()
    .describe('Constraints for the formula skeleton, such as desired notes or ingredients to avoid.'),
});
export type FormulaSkeletonInput = z.infer<typeof FormulaSkeletonInputSchema>;

const FormulaSkeletonOutputSchema = z.object({
  formula: z.string().describe('The generated base formula structure.'),
});
export type FormulaSkeletonOutput = z.infer<typeof FormulaSkeletonOutputSchema>;

export async function generateFormulaSkeleton(input: FormulaSkeletonInput): Promise<FormulaSkeletonOutput> {
  return formulaSkeletonGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formulaSkeletonGeneratorPrompt',
  input: {schema: FormulaSkeletonInputSchema},
  output: {schema: FormulaSkeletonOutputSchema},
  prompt: `You are an AI perfumer who specializes in creating base formula structures for perfumes.

  Based on the user's constraints, generate a base formula structure, listing chemical names and grams for each ingredient.
  Use grams as the unit of measurement for the ingredients.

  Constraints: {{{constraints}}}
  `,
});

const formulaSkeletonGeneratorFlow = ai.defineFlow(
  {
    name: 'formulaSkeletonGeneratorFlow',
    inputSchema: FormulaSkeletonInputSchema,
    outputSchema: FormulaSkeletonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
