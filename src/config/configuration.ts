import type { Configuration } from './configuration.schema.js';

export const configuration: Configuration = {
  api: {
    url: process.env.API_URL!,
    candidateId: process.env.CANDIDATE_ID!,
  },
  concurrency: {
    maxCalls: 5,
  },
};
