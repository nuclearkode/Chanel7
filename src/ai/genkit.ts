import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({ apiKey: 'AIzaSyB3-INtw75Ly5RNeDzyXAj8uYhVPyLzSKU' })],
  model: 'googleai/gemini-2.5-flash',
});
