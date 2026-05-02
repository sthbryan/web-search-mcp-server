import { z } from 'zod';

export const FetchSchema = z.object({
	url: z.string().url('Must be a valid URL'),
	type: z.enum(['html', 'markdown', 'text']).default('markdown'),
});

export type FetchInput = z.infer<typeof FetchSchema>;
