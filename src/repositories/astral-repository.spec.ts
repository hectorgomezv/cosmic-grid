import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { CrossmintApiClient } from '../clients/crossmint-api.client.js';
import { Cometh, Polyanet, Soloon, Space } from '../entities/astral-item.js';
import type { State } from '../entities/state.js';
import { AstralRepository } from './astral-repository.js';

describe('AstralRepository', () => {
  vi.mock('../clients/crossmint-api.client.js');
  const apiMock = { postAstralObject: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (CrossmintApiClient as unknown as Mock).mockImplementation(() => apiMock);
  });

  it.todo('implement');

  // TODO:
  // it('should call postAstralObject for each non-space item', async () => {
  //   const goal: State = [
  //     { ...new Polyanet(), row: 0, column: 0 },
  //     { ...new Space(), row: 1, column: 1 },
  //     { ...new Soloon('blue'), row: 2, column: 3 },
  //     { ...new Cometh('up'), row: 4, column: 3 },
  //     { ...new Space(), row: 5, column: 4 },
  //   ];
  //   const current: State = []; // TODO: use current state

  //   const repository = new AstralRepository();

  //   await repository.draw(goal, current);

  //   expect(apiMock.postAstralObject).toHaveBeenCalledTimes(3);
  //   expect(apiMock.postAstralObject).toHaveBeenNthCalledWith(1, {
  //     name: 'polyanet',
  //     row: 0,
  //     column: 0,
  //   });
  //   expect(apiMock.postAstralObject).toHaveBeenNthCalledWith(2, {
  //     name: 'soloon',
  //     color: 'blue',
  //     row: 2,
  //     column: 3,
  //   });
  //   expect(apiMock.postAstralObject).toHaveBeenNthCalledWith(3, {
  //     name: 'cometh',
  //     direction: 'up',
  //     row: 4,
  //     column: 3,
  //   });
  // });

  // it('should propagate errors from CrossmintApiClient.postAstralObject', async () => {
  //   (CrossmintApiClient as unknown as Mock).mockImplementation(() => apiMock);
  //   const goal: State = [{ ...new Polyanet(), row: 0, column: 0 }];
  //   const current: State = []; // TODO: use current state
  //   apiMock.postAstralObject.mockRejectedValueOnce(new Error('API error'));
  //   const repository = new AstralRepository();

  //   await expect(repository.draw(goal, current)).rejects.toThrow('API error');
  //   expect(apiMock.postAstralObject).toHaveBeenCalledTimes(1);
  //   expect(apiMock.postAstralObject).toHaveBeenCalledWith({
  //     name: 'polyanet',
  //     row: 0,
  //     column: 0,
  //   });
  // });
});
