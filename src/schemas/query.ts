import { z } from "zod";

export const queryInputSchema = z.object({
  url: z.string().url().describe("URL to query"),
  selector: z.string().optional().describe("CSS selector to match elements"),
  text: z.string().optional().describe("Text to search for within matched elements"),
});

export type QueryInput = z.infer<typeof queryInputSchema>;
