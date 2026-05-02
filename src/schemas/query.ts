import { z } from "zod";

export const QuerySchema = z.object({
  url: z.string().url("Must be a valid URL"),
  selector: z.string().optional(),
  text: z.string().optional(),
});

export type QueryInput = z.infer<typeof QuerySchema>;
