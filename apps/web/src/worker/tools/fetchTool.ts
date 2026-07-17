import { z } from 'zod';

export const fetchTool = {
  description: 'Perform an HTTP GET request to a URL and fetch the raw text response.',
  parameters: z.object({
    url: z.string().url().describe('The complete URL to fetch.'),
  }),
  execute: async ({ url }: { url: string }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      return JSON.stringify({ success: true, text: text.substring(0, 5000) }); // limit response size
    } catch (error: any) {
      return JSON.stringify({ success: false, error: error.message });
    }
  },
};
