import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import { logger } from '../common/logger.js';
import {
  CurrentStateResponseSchema,
  GoalStateResponseSchema,
  type CurrentStateResponse,
  type GoalStateResponse,
  type State,
} from '../entities/state.js';
import { StateMapper } from '../mappers/state-item-mapper.js';

export class StateRepository {
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
  async getGoalState(): Promise<State> {
    const res = await this.apiClient.getGoalState();
    const goal = this._parseGoalResponse(GoalStateResponseSchema.parse(res));
    logger.info(`[GoalsRepository] Fetched goal with ${goal.length} items`);
    return goal;
  }

  /**
   * Gets the current map the the configured candidateId.
   *
   * @returns a flattened representation of a 2D array, holding both the
   * astral object data and its position (row + column).
   */
  async getCurrentState(): Promise<State> {
    const res = await this.apiClient.getCurrentState();
    const state = this._parseStateResponse(
      CurrentStateResponseSchema.parse(res),
    );
    logger.info(`[StateRepository] Fetched state with ${state.length} items`);
    return state;
  }

  /**
   * Parses an unchecked Goal response payload coming from the API client.
   *
   * @param goalResponse unchecked payload representing a Goal map.
   * @returns checked (validated) Goal map: a flattened representation
   * of a 2D array, holding both the astral object data and its
   * position (row + column).
   */
  private _parseGoalResponse(goalResponse: GoalStateResponse): State {
    const { goal } = goalResponse;
    const result: State = [];
    for (const [row, columnItems] of goal.entries()) {
      for (const [column, item] of columnItems.entries()) {
        result.push({ ...StateMapper.mapFromGoalState(item), row, column });
      }
    }
    return result;
  }

  /**
   * Parses an unchecked State response payload coming from the API client.
   *
   * @param stateResponse unchecked payload representing a State map.
   * @returns checked (validated) State map: a flattened representation
   * of a 2D array, holding both the astral object data and its
   * position (row + column).
   */
  private _parseStateResponse(stateResponse: CurrentStateResponse): State {
    const {
      map: { content },
    } = stateResponse;
    const result: State = [];
    for (const [row, columnItems] of content.entries()) {
      for (const [column, item] of columnItems.entries()) {
        result.push({ ...StateMapper.mapFromCurrentState(item), row, column });
      }
    }
    return result;
  }
}
