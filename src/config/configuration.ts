import type { Configuration } from './configuration.schema.js';

export const configuration: Configuration = {
  general: {
    candidateId: process.env.CANDIDATE_ID!,
  },
  astralRepository: {
    maxConcurrency: process.env.ASTRAL_REPOSITORY_MAX_CONCURRENCY
      ? Number(process.env.ASTRAL_REPOSITORY_MAX_CONCURRENCY)
      : 10,
  },
  api: {
    url: process.env.API_URL!,
    retries: process.env.API_RETRIES ? Number(process.env.API_RETRIES) : 5,
    retryDelayMs: process.env.API_RETRY_DELAY_MS
      ? Number(process.env.API_RETRY_DELAY_MS)
      : 1_000,
  },
};
