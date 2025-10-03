import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import {
  GoalResponseSchema,
  type Goal,
  type GoalResponse,
} from '../entities/goal.js';
import { AstralMapper } from '../mappers/astral-mapper.js';

export class GoalsRepository {
  private readonly apiClient: CrossmintApiClient;

  constructor() {
    this.apiClient = new CrossmintApiClient();
  }

  async getGoal(): Promise<Goal> {
    const res = await this.apiClient.getGoal();
    const goal = this._parseGoalResponse(GoalResponseSchema.parse(res));
    return goal;
  }

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
