import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import { GoalsRepository } from './goals-repository.js';

describe('GoalsRepository', () => {
  vi.mock('../clients/crossmint-api.client.js');
  const apiMock = { getGoal: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (CrossmintApiClient as unknown as Mock).mockImplementation(() => apiMock);
  });

  it('should call getGoal and parse the response correctly', async () => {
    const apiResponse = {
      goal: [
        ['SPACE', 'SPACE', 'POLYANET', 'RIGHT_COMETH', 'SPACE'],
        ['UP_COMETH', 'WHITE_SOLOON', 'LEFT_COMETH', 'BLUE_SOLOON', 'SPACE'],
        ['UP_COMETH', 'WHITE_SOLOON', 'LEFT_COMETH', 'PURPLE_SOLOON', 'SPACE'],
      ],
    };
    apiMock.getGoal.mockResolvedValueOnce(apiResponse);
    const repository = new GoalsRepository();

    const goal = await repository.getGoal();

    expect(apiMock.getGoal).toHaveBeenCalledTimes(1);
    expect(goal).toEqual([
      { name: 'space', row: 0, column: 0 },
      { name: 'space', row: 0, column: 1 },
      { name: 'polyanet', row: 0, column: 2 },
      { name: 'cometh', direction: 'right', row: 0, column: 3 },
      { name: 'space', row: 0, column: 4 },
      { name: 'cometh', direction: 'up', row: 1, column: 0 },
      { name: 'soloon', color: 'white', row: 1, column: 1 },
      { name: 'cometh', direction: 'left', row: 1, column: 2 },
      { name: 'soloon', color: 'blue', row: 1, column: 3 },
      { name: 'space', row: 1, column: 4 },
      { name: 'cometh', direction: 'up', row: 2, column: 0 },
      { name: 'soloon', color: 'white', row: 2, column: 1 },
      { name: 'cometh', direction: 'left', row: 2, column: 2 },
      { name: 'soloon', color: 'purple', row: 2, column: 3 },
      { name: 'space', row: 2, column: 4 },
    ]);
  });

  it('should throw an error if the API response is invalid', async () => {
    apiMock.getGoal.mockResolvedValueOnce({ foo: 'bar' });
    const repository = new GoalsRepository();

    await expect(repository.getGoal()).rejects.toThrow();
    expect(apiMock.getGoal).toHaveBeenCalledTimes(1);
  });
});
