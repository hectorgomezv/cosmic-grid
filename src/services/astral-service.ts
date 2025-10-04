import _ from 'lodash';
import { logger } from '../common/logger.js';
import type { State } from '../entities/state.js';
import { AstralRepository } from '../repositories/astral-repository.js';
import { StateRepository } from '../repositories/state-repository.js';

export class AstralService {
  private readonly stateRepository: StateRepository;
  private readonly astralRepository: AstralRepository;

  constructor() {
    this.astralRepository = new AstralRepository();
    this.stateRepository = new StateRepository();
  }

  /**
   * Computes the difference between the goal and the current states,
   * and places the astral objects to make both states equal.
   *
   * Given that the underlying drawing mechanism might fail, it iterates
   * until there is no difference between the goal and current states.
   *
   * @param goal goal {@link State}
   * @param current current {@link State}
   */
  async draw(): Promise<void> {
    let run: number = 1;
    let diff: State = [];
    // TODO: check algorithm
    while (run === 1 || diff.length > 0) {
      logger.info(`[AstralRepository] Draw #${run}`);
      run++;
      const goal = await this.stateRepository.getGoalState();
      const current = await this.stateRepository.getCurrentState();
      const diff = _.differenceWith(goal, current, _.isEqual);
      if (diff.length > 0) {
        await this.astralRepository.placeAstralObjects(diff);
        await new Promise((_) => setTimeout(_, 10_000));
      }
    }
  }
}
