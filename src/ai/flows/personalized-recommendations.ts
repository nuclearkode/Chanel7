'use server';

/**
 * @fileOverview AI-powered personalized ingredient recommendations based on user scent profiles.
 *
 * - getPersonalizedRecommendations - A function to generate ingredient recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  scentProfile: z
    .string()
    .describe(
      'The user’s scent profile, including liked, disliked, and neutral ingredients.'
    ),
  availableIngredients: z
    .string()
    .describe('A list of available ingredients to choose from.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of recommended ingredients based on the user profile.'),
  reasoning: z
    .string()
    .describe('Explanation of why the ingredients are recommended.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert fragrance recommendation system. Based on the user's provided scent profile and a list of available ingredients, suggest ingredients that the user would likely appreciate.

Scent Profile: {{{scentProfile}}}
Available Ingredients: {{{availableIngredients}}}

Provide the ingredient recommendations and reasoning for each recommendation.
`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
