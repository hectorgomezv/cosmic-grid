import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import {
  GoalResponseSchema,
  type Goal,
  type GoalResponse,
} from '../entities/goal.js';
import { logger } from '../common/logger.js';
import { AstralMapper } from '../mappers/astral-mapper.js';

export class GoalsRepository {
  private readonly apiClient: CrossmintApiClient;

  constructor() {
    this.apiClient = new CrossmintApiClient();
  }

  /**
   * Gets a Goal map of astral objects.
   *
   * @returns a flattened representation of a 2D array, holding both the
   * astral object data and its position (row + column).
   */
  async getGoal(): Promise<Goal> {
    const res = await this.apiClient.getGoal();
    const goal = this._parseGoalResponse(GoalResponseSchema.parse(res));
    logger.info(`[GoalsRepository] Fetched goal with ${goal.length} items`);
    return goal;
  }

  /**
   * Parses an unchecked Goal response payload coming from the API client.
   *
   * @param goalResponse unchecked payload representing a Goal map.
   * @returns checked (validated) Goal map: a flattened representation
   * of a 2D array, holding both the astral object data and its
   * position (row + column).
   */
  private _parseGoalResponse(goalResponse: GoalResponse): Goal {
    const { goal } = goalResponse;
    const result: Goal = [];
    for (const [row, columnItems] of goal.entries()) {
      for (const [column, item] of columnItems.entries()) {
        result.push({ ...AstralMapper.map(item), row, column });
      }
    }
    return result;
  }
}
