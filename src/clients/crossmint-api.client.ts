import type { AstralItem } from '../entities/astral-item.js';
import type { Position } from '../entities/position.js';
import { configuration } from '../config/configuration.js';

export class CrossmintApiClient {
  private readonly apiUrl = configuration.api.url;
  private readonly candidateId = configuration.api.candidateId;

  async getGoal(): Promise<unknown> {
    const res = await fetch(`${this.apiUrl}/map/${this.candidateId}/goal`);
    if (!res.ok) throw new Error('Cannot retrieve goal');
    return res.json();
  }

  async postAstralObject(item: AstralItem & Position): Promise<void> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const url = `${this.apiUrl}/${this._getResourcePath(item)}`;
    const { name, ...itemFields } = item;
    await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...itemFields,
        candidateId: this.candidateId,
      }),
    });
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
