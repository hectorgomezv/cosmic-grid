import z from 'zod';

export const ConfigurationSchema = z.object({
  api: z.object({
    url: z.url().optional().default('https://challenge.crossmint.com/api'),
    candidateId: z.string().min(1, 'CANDIDATE_ID must be a non-empty string'),
  }),
  concurrency: z.object({
    maxCalls: z.number().optional().default(10),
  }),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
