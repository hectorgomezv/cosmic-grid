import type { AstralItem } from '../entities/astral-item.js';
import type { Position } from '../entities/position.js';
import { configuration } from '../config/configuration.js';
import { logger } from '../common/logger.js';

export class CrossmintApiClient {
  private readonly apiUrl = configuration.api.url;
  private readonly candidateId = configuration.api.candidateId;

  async getGoal(): Promise<unknown> {
    try {
      const url = `${this.apiUrl}/map/${this.candidateId}/goal`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`GET ${url} failed (${res.status} ${res.statusText})`);
      }
      return res.json();
    } catch (err) {
      logger.error({ err }, `Error getting goal: ${err}`);
      throw err;
    }
  }

  async postAstralObject(item: AstralItem & Position): Promise<void> {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const url = `${this.apiUrl}/${this._getResourcePath(item)}`;
      const { name, ...itemFields } = item;
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...itemFields,
          candidateId: this.candidateId,
        }),
      });
      if (!res.ok) {
        throw new Error(`POST ${url} failed (${res.status} ${res.statusText})`);
      }
    } catch (err) {
      logger.error({ item, err }, `Error posting object: ${err}`);
      throw err;
    }
  }

  /**
   * Given an astral object, computes its resource path
   * to be concatenated to the full API path later on.
   *
   * @param item item to compute its resource path.
   * @returns computed resource path fragment.
   */
  private _getResourcePath(item: AstralItem): string {
    switch (item.name) {
      case 'polyanet':
        return 'polyanets';
      case 'soloon':
        return 'soloons';
      case 'cometh':
        return 'comeths';
      default:
        throw new Error(`No resource path for ${item.name}`);
    }
  }
}
