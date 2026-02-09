'use server';

/**
 * @fileOverview An AI agent that analyzes a fragrance formula in real-time, providing insights on scent profile, ingredient interactions, and cost.
 *
 * - analyzeFormulaCanvas - Analyzes the formula.
 * - FormulaCanvasInput - Input type.
 * - FormulaCanvasOutput - Output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CanvasIngredientSchema = z.object({
    name: z.string().describe('The name of the ingredient.'),
    concentration: z.number().describe('The concentration of the ingredient in the formula (percentage).'),
});

const FormulaCanvasInputSchema = z.object({
  ingredients: z.array(CanvasIngredientSchema).describe('A list of ingredients in the current formula canvas.'),
});
export type FormulaCanvasInput = z.infer<typeof FormulaCanvasInputSchema>;

const FormulaCanvasOutputSchema = z.object({
    finalScentProfile: z.string().describe("A detailed, evocative description of the final resulting scent profile."),
    ingredientInteractions: z.array(z.object({
        ingredients: z.array(z.string()).describe("The ingredients involved in the interaction."),
        effect: z.string().describe("The effect of the interaction (e.g., 'enhances citrus notes', 'creates a soft leather accord', 'may form a Schiff base').")
    })).describe("An analysis of how the selected ingredients will interact with each other."),
    longevityEstimate: z.enum(['Short (1-3 hours)', 'Moderate (4-6 hours)', 'Long (7+ hours)']).describe("An estimation of the fragrance's longevity on skin."),
    projectionEstimate: z.enum(['Intimate', 'Moderate', 'Strong']).describe("An estimation of the fragrance's projection (sillage).")
});
export type FormulaCanvasOutput = z.infer<typeof FormulaCanvasOutputSchema>;


export async function analyzeFormulaCanvas(
  input: FormulaCanvasInput
): Promise<FormulaCanvasOutput> {
  return formulaCanvasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formulaCanvasPrompt',
  input: {schema: FormulaCanvasInputSchema},
  output: {schema: FormulaCanvasOutputSchema},
  prompt: `You are an expert master perfumer with a deep understanding of fragrance chemistry and artistry. A user is building a formula on an interactive canvas. Analyze the provided list of ingredients and their concentrations.

  Ingredients:
  {{#each ingredients}}
  - {{this.name}}: {{this.concentration}}%
  {{/each}}

  Based on this formula, provide a detailed analysis. Your analysis must include:
  1.  **Final Scent Profile**: Write a rich, creative, and evocative description of what the final fragrance will smell like. Imagine you are writing marketing copy for a luxury perfume.
  2.  **Ingredient Interactions**: Identify key interactions between pairs or groups of ingredients. Describe the effect of these interactions, noting both positive synergies (e.g., creating a new accord) and potential issues (e.g., chemical reactions like Schiff bases, overpowering notes).
  3.  **Longevity Estimate**: Estimate how long the fragrance will last on the skin.
  4.  **Projection Estimate**: Estimate the sillage or projection of the fragrance.

  Be precise, insightful, and professional. Output the analysis in the specified JSON format.
  `,
});

const formulaCanvasFlow = ai.defineFlow(
  {
    name: 'formulaCanvasFlow',
    inputSchema: FormulaCanvasInputSchema,
    outputSchema: FormulaCanvasOutputSchema,
  },
  async input => {
    // In a real app, you might fetch more ingredient data here (e.g., from a DB)
    // to provide more context to the AI, but for now, we'll just use the names.
    if (input.ingredients.length === 0) {
        throw new Error("Cannot analyze an empty formula.");
    }
    const {output} = await prompt(input);
    return output!;
  }
);
