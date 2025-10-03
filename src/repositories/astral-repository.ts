import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import { type AstralItem } from '../entities/astral-item.js';
import type { Goal } from '../entities/goal.js';
import type { Position } from '../entities/position.js';

export class AstralRepository {
  private readonly apiClient: CrossmintApiClient;

  constructor() {
    this.apiClient = new CrossmintApiClient();
  }

  async setAstralObjects(goal: Goal): Promise<void> {
    await Promise.all(
      // TODO: backpressure?
      goal
        .filter((item) => item.name !== 'space')
        .map((item) => this.apiClient.postAstralObject(item)),
    );
  }
}
