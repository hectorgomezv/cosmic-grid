import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import { configuration } from '../config/configuration.js';
import type { Goal } from '../entities/goal.js';

export class AstralRepository {
  private readonly apiClient: CrossmintApiClient;
  private readonly maxCalls = configuration.concurrency.maxCalls;

  constructor() {
    this.apiClient = new CrossmintApiClient();
  }

  /**
   * Draws a goal map of astral objects.
   *
   * Limits concurrency by sending parallel calls to the HTTP client
   * in chunks of size {@link maxCalls}.
   *
   * @param goal array of positions and astral items to draw
   */
  async draw(goal: Goal): Promise<void> {
    const objects = goal.filter((item) => item.name !== 'space');
    for (let i = 0; i < objects.length; i += this.maxCalls) {
      const chunk = objects.slice(i, i + this.maxCalls);
      await Promise.all(chunk.map((o) => this.apiClient.postAstralObject(o)));
    }
  }
}
