import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import { logger } from '../common/logger.js';
import { configuration } from '../config/configuration.js';
import type { State } from '../entities/state.js';

export class AstralRepository {
  private readonly apiClient: CrossmintApiClient;
  private readonly maxConcurrency =
    configuration.astralRepository.maxConcurrency;

  constructor() {
    this.apiClient = new CrossmintApiClient();
  }

  /**
   * Places astral objects present in the diff {@link State}.
   *
   * Limits concurrency by sending parallel calls to the HTTP client
   * in chunks of size {@link maxConcurrency}.
   *
   * @param diff array of positions and astral items to draw
   */
  async placeAstralObjects(diff: State): Promise<void> {
    for (let i = 0; i < diff.length; i += this.maxConcurrency) {
      const chunk = diff.slice(i, i + this.maxConcurrency);
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
