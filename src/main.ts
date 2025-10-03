import 'dotenv/config';
import { AstralRepository } from './repositories/astral-repository.js';
import { GoalsRepository } from './repositories/goals-repository.js';

const main = async () => {
  const goalsRepository = new GoalsRepository();
  const astralRepository = new AstralRepository();

  const goal = await goalsRepository.getGoal();
  await astralRepository.setAstralObjects(goal);
};

main();
