'use server';

/**
 * @fileOverview This file contains the Genkit flow for dynamically adjusting AI scent profile recommendations based on user sensitivity patterns in the Comparison Game.
 *
 * - dynamicSensitivityAdjustments - The main function to trigger the flow.
 * - DynamicSensitivityAdjustmentsInput - The input type for the dynamicSensitivityAdjustments function.
 * - DynamicSensitivityAdjustmentsOutput - The output type for the dynamicSensitivityAdjustments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicSensitivityAdjustmentsInputSchema = z.object({
  comparisonGameData: z.array(
    z.object({
      material1: z.string().describe('The name of the first material in the comparison.'),
      material2: z.string().describe('The name of the second material in the comparison.'),
      ratio: z.string().describe('The ratio at which the two materials balance each other.'),
      userPreference: z.string().describe('The user\u2019s preference between the two materials.'),
    })
  ).describe('An array of comparison data from the Comparison Game.'),
  userScentProfile: z.record(z.number()).describe('The user\u2019s current scent profile as a record of scent categories and sensitivity values.'),
});
export type DynamicSensitivityAdjustmentsInput = z.infer<typeof DynamicSensitivityAdjustmentsInputSchema>;

const DynamicSensitivityAdjustmentsOutputSchema = z.record(z.number()).describe('The adjusted scent profile based on the comparison game data.');
export type DynamicSensitivityAdjustmentsOutput = z.infer<typeof DynamicSensitivityAdjustmentsOutputSchema>;

export async function dynamicSensitivityAdjustments(input: DynamicSensitivityAdjustmentsInput): Promise<DynamicSensitivityAdjustmentsOutput> {
  return dynamicSensitivityAdjustmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dynamicSensitivityAdjustmentsPrompt',
  input: {schema: DynamicSensitivityAdjustmentsInputSchema},
  output: {schema: DynamicSensitivityAdjustmentsOutputSchema},
  prompt: `You are an AI scent expert. Analyze the user's comparison game data to understand their sensitivity to different scent profiles.

  Comparison Game Data:
  {{#each comparisonGameData}}
    - Material 1: {{this.material1}}, Material 2: {{this.material2}}, Ratio: {{this.ratio}}, User Preference: {{this.userPreference}}
  {{/each}}

  Current User Scent Profile:
  {{#each userScentProfile}}
    {{@key}}: {{this}}
  {{/each}}

  Based on this data, adjust the user's scent profile to better reflect their individual preferences.
  Return the adjusted scent profile as a record of scent categories and sensitivity values.
  Ensure that all scent categories present in the userScentProfile are still present in the adjusted scent profile.
  Do not explain, just return the JSON.
  `,
});

const dynamicSensitivityAdjustmentsFlow = ai.defineFlow(
  {
    name: 'dynamicSensitivityAdjustmentsFlow',
    inputSchema: DynamicSensitivityAdjustmentsInputSchema,
    outputSchema: DynamicSensitivityAdjustmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
