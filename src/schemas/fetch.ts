import { z } from "zod";

export const fetchInputSchema = z.object({
  url: z.string().url().describe("URL to fetch"),
  type: z
    .enum(["html", "markdown", "text"])
    .optional()
    .default("markdown")
    .describe("Output format"),
});

export type FetchInput = z.infer<typeof fetchInputSchema>;
