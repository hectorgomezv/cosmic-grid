import {
  Cometh,
  Polyanet,
  Soloon,
  Space,
  type AstralItem,
} from '../entities/astral-item.js';

export class AstralMapper {
  static map(input: string): AstralItem {
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
}
