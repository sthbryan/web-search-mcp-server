import { z } from "zod";

export const SearchSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  limit: z.number().int().positive().max(50).default(10),
});

export type SearchInput = z.infer<typeof SearchSchema>;
