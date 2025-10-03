import 'dotenv/config';
import { configuration } from './config/configuration.js';
import { AstralRepository } from './repositories/astral-repository.js';
import { GoalsRepository } from './repositories/goals-repository.js';
import { ConfigurationSchema } from './config/configuration.schema.js';

/**
 * Main entry point.
 * This function validates the app configuration, creates the repository classes,
 * gets the goal, and draws the objects present in the goal payload.
 */
const main = async () => {
  ConfigurationSchema.parse(configuration);

  const goalsRepository = new GoalsRepository();
  const astralRepository = new AstralRepository();

  const goal = await goalsRepository.getGoal();
  await astralRepository.draw(goal);
};

main();
