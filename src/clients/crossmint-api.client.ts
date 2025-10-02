import type { AstralItem } from '../entities/astral-item.js';
import type { Position } from '../entities/position.js';

export class CrossmintApiClient {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.API_URL ?? 'https://challenge.crossmint.com/api';
  }

  async getGoal(candidateId: string): Promise<unknown> {
    const res = await fetch(`${this.apiUrl}/map/${candidateId}/goal`);
    if (!res.ok) throw new Error('Cannot retrieve goal');
    return res.json();
  }

  async postAstralObject(args: {
    candidateId: string;
    item: AstralItem & Position;
  }): Promise<void> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const url = `${this.apiUrl}/${this._getResourcePath(args.item)}`;
    const { name, ...itemFields } = args.item;
    await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...itemFields,
        candidateId: args.candidateId,
      }),
    });
  }

  private _getResourcePath(item: AstralItem & Position) {
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
