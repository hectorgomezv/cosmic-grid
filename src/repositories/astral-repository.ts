import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import { logger } from '../common/logger.js';
import { configuration } from '../config/configuration.js';
import type { Goal } from '../entities/goal.js';

export class AstralRepository {
  private readonly apiClient: CrossmintApiClient;
  private readonly maxConcurrency =
    configuration.astralRepository.maxConcurrency;

  constructor() {
    this.apiClient = new CrossmintApiClient();
  }

  /**
   * Draws a goal map of astral objects.
   *
   * Limits concurrency by sending parallel calls to the HTTP client
   * in chunks of size {@link maxConcurrency}.
   *
   * @param goal array of positions and astral items to draw
   */
  async draw(goal: Goal): Promise<void> {
    const astralObjects = goal.filter((item) => item.name !== 'space');
    for (let i = 0; i < astralObjects.length; i += this.maxConcurrency) {
      const chunk = astralObjects.slice(i, i + this.maxConcurrency);
      await Promise.all(
        chunk.map((astralObject) => {
          const { name, row, column } = astralObject;
          logger.info(`[AstralRepository] Drawing ${name} (${row}, ${column})`);
          return this.apiClient.postAstralObject(astralObject);
        }),
      );
    }
  }
}
