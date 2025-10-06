import { RateLimitError } from '../common/errors/rate-limit.error.js';
import { logger } from '../common/logger.js';
import { configuration } from '../config/configuration.js';
import type { AstralItem } from '../entities/astral-item.js';
import type { Position } from '../entities/position.js';

export class CrossmintApiClient {
  private readonly apiConfiguration = configuration.api;
  private readonly candidateId = configuration.general.candidateId;

  async getGoalState(): Promise<unknown> {
    try {
      const url = `${this.apiConfiguration.url}/map/${this.candidateId}/goal`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`GET ${url} failed (${res.status} ${res.statusText})`);
      }
      return res.json();
    } catch (err) {
      logger.error(`[CrossmintApiClient] Error getting goal: ${err}`);
      throw err;
    }
  }

  async getCurrentState(): Promise<unknown> {
    try {
      const url = `${this.apiConfiguration.url}/map/${this.candidateId}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`GET ${url} failed (${res.status} ${res.statusText})`);
      }
      return res.json();
    } catch (err) {
      logger.error(`[CrossmintApiClient] Error getting current state: ${err}`);
      throw err;
    }
  }

  async postAstralObject(item: AstralItem & Position): Promise<void> {
    const url = `${this.apiConfiguration.url}/${this._getResourcePath(item)}`;
    const { name, ...itemFields } = item;
    const requestConfig: RequestInit = {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        ...itemFields,
        candidateId: this.candidateId,
      }),
    };
    const res = await this._fetchWithRetry(url, requestConfig);
    if (res.ok)
      logger.info(
        `[CrossmintApiClient] Posted ${name} at (${item.row}, ${item.column})`,
      );
  }

  /**
   * Executes a request, retrying if it throws a retriable error.
   * (see {@link _isRetriableError}).
   *
   * Uses a exponential backoff strategy by retrying each
   * {@link apiConfiguration.retryDelayMs} * {@link attempt} ms,
   * plus a random jitter to spread the requests.
   * Fails if {@link maxAttempts} is reached.
   *
   * @param url url to fetch.
   */
  private _fetchWithRetry = async (
    url: string,
    requestConfig: RequestInit,
  ): Promise<Response> => {
    const { retries, retryDelayMs } = this.apiConfiguration;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, requestConfig);
        if (res.ok) return res;
        if (res.status === 429) throw new RateLimitError();
        throw new Error(`Request failed: ${res.status}`);
      } catch (err) {
        if (this._isRetriableError(err)) {
          logger.warn(`[CrossmintApiClient] Retrying request (#${attempt})`);
          const jitter = Math.random() * 1000;
          await this._waitMilliseconds(retryDelayMs * attempt + jitter);
        } else {
          throw err;
        }
      }
    }
    throw new Error(`Max of ${retries} retries reached`);
  };

  /**
   * Returns whether the given error is retriable.
   *
   * Currently, only network errors, timeouts, and rate limit
   * errors are considered retriable.
   *
   * @param err error to evaluate.
   * @returns true if the error is retriable, false otherwise.
   */
  private _isRetriableError(err: any): boolean {
    return (
      (err.code && err.code.includes('TIMEOUT')) ||
      err.name === 'AbortError' ||
      err instanceof RateLimitError
    );
  }

  /**
   * Creates a Promise that resolves after {@link milliseconds} milliseconds.
   */
  async _waitMilliseconds(milliseconds: number): Promise<void> {
    await new Promise((_) => setTimeout(_, milliseconds));
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
