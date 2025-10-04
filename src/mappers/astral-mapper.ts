import {
  Cometh,
  Polyanet,
  Soloon,
  Space,
  type AstralItem,
} from '../entities/astral-item.js';

// TODO: move to state-item-mapper.ts and rename

/**
 * Maps a given Goal input string to a instance of a known
 * {@link AstralItem} subclass, including its specific properties.
 */
export class AstralMapper {
  static mapFromGoal(input: string): AstralItem {
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

  // TODO: TSDoc
  static mapFromCurrentState(
    input: null | { type: number; direction?: string; color?: string },
  ): AstralItem {
    switch (true) {
      case input === null:
        return new Space();
      case input?.type === 0:
        return new Polyanet();
      case input?.type === 1:
        return new Soloon(input.color!);
      case input?.type === 2:
        return new Cometh(input.direction!);
      default:
        throw new Error(`Unknown input type: ${input}`);
    }
  }
}
