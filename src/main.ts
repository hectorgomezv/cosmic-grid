import 'dotenv/config';
import { AstralRepository } from './repositories/astral-repository.js';
import { GoalsRepository } from './repositories/goals-repository.js';

const main = async () => {
  const candidateId = process.env.CANDIDATE_ID;
  if (!candidateId) throw new Error('Invalid candidate ID');

  const goalsRepository = new GoalsRepository();
  const astralRepository = new AstralRepository();

  const goal = await goalsRepository.getGoal(candidateId);
  await astralRepository.setAstralObjects({ candidateId, goal });
};

main();
