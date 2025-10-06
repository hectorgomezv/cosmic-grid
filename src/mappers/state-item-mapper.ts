import {
  Cometh,
  Polyanet,
  Soloon,
  Space,
  type AstralItem,
} from '../entities/astral-item.js';
import type { CurrentStateItem } from '../entities/state.js';

/**
 * Maps a given Goal state input string to a instance of a known
 * {@link AstralItem} subclass, including its specific properties.
 */
export class StateMapper {
  static mapFromGoalState(input: string): AstralItem {
    switch (true) {
      case input === 'SPACE':
        return new Space();
      case input === 'POLYANET':
        return new Polyanet();
      case input.endsWith('_SOLOON'): {
        const color = input.replace('_SOLOON', '').toLowerCase();
        return new Soloon(color);
      }
      case input.endsWith('_COMETH'): {
        const direction = input.replace('_COMETH', '').toLowerCase();
        return new Cometh(direction);
      }
      default:
        throw new Error(`Unknown input type: ${input}`);
    }
  }

  /**
   * Maps a given current state string to a instance of a known
   * {@link AstralItem} subclass, including its specific properties.
   */
  static mapFromCurrentState(input: CurrentStateItem): AstralItem {
    switch (true) {
      case input === null:
        return new Space();
      case input?.type === 0:
        return new Polyanet();
      case input?.type === 1: {
        const item = input as { type: number; color: string };
        return new Soloon(item.color);
      }
      case input?.type === 2: {
        const item = input as { type: number; direction: string };
        return new Cometh(item.direction);
      }
      default:
        throw new Error(`Unknown input type: ${input}`);
    }
  }
}
