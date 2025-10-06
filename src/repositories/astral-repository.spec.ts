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

  it('should call postAstralObject for each element in the diff', async () => {
    const diff: State = [
      { ...new Polyanet(), row: 0, column: 0 },
      { ...new Soloon('blue'), row: 2, column: 3 },
      { ...new Cometh('up'), row: 4, column: 3 },
    ];
    const repository = new AstralRepository();

    await repository.placeAstralObjects(diff);

    expect(apiMock.postAstralObject).toHaveBeenCalledTimes(3);
    expect(apiMock.postAstralObject).toHaveBeenNthCalledWith(1, {
      name: 'polyanet',
      row: 0,
      column: 0,
    });
    expect(apiMock.postAstralObject).toHaveBeenNthCalledWith(2, {
      name: 'soloon',
      color: 'blue',
      row: 2,
      column: 3,
    });
    expect(apiMock.postAstralObject).toHaveBeenNthCalledWith(3, {
      name: 'cometh',
      direction: 'up',
      row: 4,
      column: 3,
    });
  });

  it('should propagate errors from CrossmintApiClient.postAstralObject', async () => {
    (CrossmintApiClient as unknown as Mock).mockImplementation(() => apiMock);
    const diff: State = [{ ...new Polyanet(), row: 0, column: 0 }];
    apiMock.postAstralObject.mockRejectedValueOnce(new Error('API error'));
    const repository = new AstralRepository();

    await expect(repository.placeAstralObjects(diff)).rejects.toThrow(
      'API error',
    );
    expect(apiMock.postAstralObject).toHaveBeenCalledTimes(1);
    expect(apiMock.postAstralObject).toHaveBeenCalledWith({
      name: 'polyanet',
      row: 0,
      column: 0,
    });
  });
});
