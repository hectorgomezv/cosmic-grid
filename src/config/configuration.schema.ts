import z from 'zod';

export const ConfigurationSchema = z.object({
  general: z.object({
    candidateId: z.string().min(1, 'CANDIDATE_ID must be a non-empty string'),
  }),
  astralRepository: z.object({
    maxConcurrency: z.number().int().min(1),
  }),
  api: z.object({
    url: z.url().optional().default('https://challenge.crossmint.com/api'),
    retries: z.number().min(1),
    retryDelayMs: z.number().positive(),
  }),
});

export type Configuration = z.infer<typeof ConfigurationSchema>;
