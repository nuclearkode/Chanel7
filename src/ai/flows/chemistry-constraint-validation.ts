'use server';

/**
 * @fileOverview A flow that validates the chemical compatibility of selected materials and provides warnings for problematic combinations.
 *
 * - chemistryConstraintValidation - A function that validates chemical compatibility.
 * - ChemistryConstraintValidationInput - The input type for the chemistryConstraintValidation function.
 * - ChemistryConstraintValidationOutput - The return type for the chemistryConstraintValidation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChemistryConstraintValidationInputSchema = z.object({
  materials: z
    .array(z.string())
    .describe('An array of chemical names to validate for compatibility.'),
});
export type ChemistryConstraintValidationInput = z.infer<
  typeof ChemistryConstraintValidationInputSchema
>;

const ChemistryConstraintValidationOutputSchema = z.object({
  warnings: z
    .array(z.string())
    .describe(
      'An array of warning messages indicating potential incompatibility issues.'
    ),
  compatible: z
    .boolean()
    .describe(
      'A boolean indicating whether the selected materials are compatible.'
    ),
});
export type ChemistryConstraintValidationOutput = z.infer<
  typeof ChemistryConstraintValidationOutputSchema
>;

export async function chemistryConstraintValidation(
  input: ChemistryConstraintValidationInput
): Promise<ChemistryConstraintValidationOutput> {
  return chemistryConstraintValidationFlow(input);
}

const chemistryConstraintValidationPrompt = ai.definePrompt({
  name: 'chemistryConstraintValidationPrompt',
  input: {schema: ChemistryConstraintValidationInputSchema},
  output: {schema: ChemistryConstraintValidationOutputSchema},
  prompt: `You are an expert chemist specializing in fragrance formulation.

You will receive a list of materials and must determine if they are chemically compatible.
If there are any potential issues, provide a warning message. If the materials are safe, then the warnings array should be empty, and compatible should be true.

Materials: {{{materials}}}

Respond in JSON format.`,
});

const chemistryConstraintValidationFlow = ai.defineFlow(
  {
    name: 'chemistryConstraintValidationFlow',
    inputSchema: ChemistryConstraintValidationInputSchema,
    outputSchema: ChemistryConstraintValidationOutputSchema,
  },
  async input => {
    const {output} = await chemistryConstraintValidationPrompt(input);
    return output!;
  }
);
