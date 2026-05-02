import { z } from "zod";

export const searchInputSchema = z.object({
  query: z.string().describe("Search query"),
  limit: z
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .default(10)
    .describe("Maximum number of results"),
});

export type SearchInput = z.infer<typeof searchInputSchema>;
