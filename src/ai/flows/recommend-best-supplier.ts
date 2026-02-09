'use server';

/**
 * @fileOverview AI tool to recommend the best supplier for material purchases based on value, speed, or a combination.
 *
 * - recommendBestSupplier - A function that recommends the best supplier based on specified criteria.
 * - RecommendBestSupplierInput - The input type for the recommendBestSupplier function.
 * - RecommendBestSupplierOutput - The return type for the recommendBestSupplier function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendBestSupplierInputSchema = z.object({
  materialName: z.string().describe('The name of the material to purchase.'),
  quantity: z.number().describe('The quantity of the material needed.'),
  criteria: z
    .enum(['value', 'speed', 'combined'])
    .describe(
      'The criteria to use when recommending a supplier: value (best price), speed (fastest delivery), or combined (best balance of price and speed).' // Corrected description
    ),
});
export type RecommendBestSupplierInput = z.infer<typeof RecommendBestSupplierInputSchema>;

const RecommendBestSupplierOutputSchema = z.object({
  supplierName: z.string().describe('The name of the recommended supplier.'),
  price: z.number().describe('The price of the material from the recommended supplier.'),
  deliveryTime: z.string().describe('The estimated delivery time from the recommended supplier.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the supplier recommendation.'),
});
export type RecommendBestSupplierOutput = z.infer<typeof RecommendBestSupplierOutputSchema>;

export async function recommendBestSupplier(
  input: RecommendBestSupplierInput
): Promise<RecommendBestSupplierOutput> {
  return recommendBestSupplierFlow(input);
}

const recommendBestSupplierPrompt = ai.definePrompt({
  name: 'recommendBestSupplierPrompt',
  input: {schema: RecommendBestSupplierInputSchema},
  output: {schema: RecommendBestSupplierOutputSchema},
  prompt: `You are an expert in fragrance material supply chains.  Given the following material, quantity, and criteria, recommend the best supplier.

Material: {{materialName}}
Quantity: {{quantity}}
Criteria: {{criteria}}

Consider price, delivery time, and any other relevant factors to provide a well-reasoned recommendation. Use the descriptions from the schema to inform the structure of the response. Adhere to the output schema, especially with respect to the descriptions provided for each field.
`, // Adhering to output schema and providing a well reasoned recommendation
});

const recommendBestSupplierFlow = ai.defineFlow(
  {
    name: 'recommendBestSupplierFlow',
    inputSchema: RecommendBestSupplierInputSchema,
    outputSchema: RecommendBestSupplierOutputSchema,
  },
  async input => {
    const {output} = await recommendBestSupplierPrompt(input);
    return output!;
  }
);
