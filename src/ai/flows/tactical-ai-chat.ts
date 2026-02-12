'use server';

/**
 * @fileOverview General-purpose chat interface for the Tactical AI assistant.
 *
 * - tacticalAIChat - A flow that processes user messages and returns a helpful response.
 * - TacticalAIChatInput - The input type for the tacticalAIChat function.
 * - TacticalAIChatOutput - The return type for the tacticalAIChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']).describe('The role of the message sender.'),
  content: z.string().describe('The content of the message.'),
});

const TacticalAIChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history so far.'),
  message: z.string().describe('The new message from the user.'),
});
export type TacticalAIChatInput = z.infer<typeof TacticalAIChatInputSchema>;

const TacticalAIChatOutputSchema = z.object({
  response: z.string().describe('The AI response to the user.'),
});
export type TacticalAIChatOutput = z.infer<typeof TacticalAIChatOutputSchema>;

export async function tacticalAIChat(input: TacticalAIChatInput): Promise<TacticalAIChatOutput> {
  return tacticalAIChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tacticalAIChatPrompt',
  input: {schema: TacticalAIChatInputSchema},
  output: {schema: TacticalAIChatOutputSchema},
  prompt: `You are a highly skilled and knowledgeable Tactical AI assistant for a professional perfumer.
  You have deep expertise in fragrance chemistry, ingredient interactions, accords, and formulation.

  Your goal is to assist the perfumer with their creative process, answer questions about materials, suggest pairings, and provide insights.
  Be concise, professional, and helpful.

  Conversation History:
  {{#each history}}
  - {{this.role}}: {{this.content}}
  {{/each}}

  User: {{message}}

  Output a JSON object containing your response.
  `,
});

const tacticalAIChatFlow = ai.defineFlow(
  {
    name: 'tacticalAIChatFlow',
    inputSchema: TacticalAIChatInputSchema,
    outputSchema: TacticalAIChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
