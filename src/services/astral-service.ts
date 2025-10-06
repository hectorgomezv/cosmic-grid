import _ from 'lodash';
import { logger } from '../common/logger.js';
import type { State } from '../entities/state.js';
import { AstralRepository } from '../repositories/astral-repository.js';
import { StateRepository } from '../repositories/state-repository.js';

export class AstralService {
  public static readonly DELAY_MS = 10_000;
  private static readonly MAX_RUNS = 10;
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

    while (run === 1 || (diff.length > 0 && run <= AstralService.MAX_RUNS)) {
      logger.info(`[AstralRepository] Draw #${run}`);
      run++;
      const goal = await this.stateRepository.getGoalState();
      const current = await this.stateRepository.getCurrentState();
      diff = _.differenceWith(goal, current, _.isEqual);
      logger.info(`[AstralRepository] ${diff.length} differences found`);
      if (diff.length > 0) {
        await this.astralRepository.placeAstralObjects(diff);
        await new Promise((_) => setTimeout(_, AstralService.DELAY_MS));
      }
    }

    if (diff.length > 0) {
      throw new Error(`Max runs (${AstralService.MAX_RUNS}) reached`);
    }
    logger.info('[AstralRepository] Goal State reached');
  }
}
