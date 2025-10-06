import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { AstralRepository } from '../repositories/astral-repository.js';
import { StateRepository } from '../repositories/state-repository.js';
import { AstralService } from './astral-service.js';
import { Polyanet, Space, Soloon, Cometh } from '../entities/astral-item.js';
import type { State } from '../entities/state.js';

describe('AstralService', () => {
  vi.mock('../repositories/astral-repository.js');
  const repositoryMock = { placeAstralObjects: vi.fn() };
  vi.mock('../repositories/state-repository.js');
  const stateRepoMock = { getGoalState: vi.fn(), getCurrentState: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (AstralRepository as unknown as Mock).mockImplementation(
      () => repositoryMock,
    );
    (StateRepository as unknown as Mock).mockImplementation(
      () => stateRepoMock,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call placeAstralObjects until goal and current states are equal', async () => {
    const goalState: State = [
      { ...new Polyanet(), row: 0, column: 0 },
      { ...new Space(), row: 1, column: 1 },
      { ...new Soloon('blue'), row: 2, column: 3 },
      { ...new Cometh('up'), row: 4, column: 3 },
      { ...new Space(), row: 5, column: 4 },
    ];
    const currentState: State = goalState.slice(0, 3);
    stateRepoMock.getGoalState
      .mockResolvedValueOnce(goalState)
      .mockResolvedValueOnce(goalState);
    stateRepoMock.getCurrentState
      .mockResolvedValueOnce(currentState)
      .mockResolvedValueOnce(goalState);
    const service = new AstralService();

    const draw = service.draw();
    await vi.advanceTimersByTimeAsync(AstralService.DELAY_MS + 1);
    await vi.runAllTicks();
    await draw;

    expect(stateRepoMock.getGoalState).toHaveBeenCalledTimes(2);
    expect(stateRepoMock.getCurrentState).toHaveBeenCalledTimes(2);
    expect(repositoryMock.placeAstralObjects).toHaveBeenCalledTimes(1);
    expect(repositoryMock.placeAstralObjects).toHaveBeenCalledWith(
      goalState.slice(3),
    );
  });
});
