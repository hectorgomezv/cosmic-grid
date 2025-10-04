export class RateLimitError extends Error {
  public status: number;

  constructor() {
    super();
    this.status = 429;
  }
}
