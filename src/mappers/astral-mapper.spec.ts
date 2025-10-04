import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { AstralMapper } from './astral-mapper.js';
import { Cometh, Polyanet, Soloon, Space } from '../entities/astral-item.js';

describe('AstralMapper', () => {
  it('should map "SPACE" -> Space', () => {
    const result = AstralMapper.mapFromGoal('SPACE');
    expect(result).toBeInstanceOf(Space);
  });

  it('should map "POLYANET" -> Polyanet', () => {
    const result = AstralMapper.mapFromGoal('POLYANET');
    expect(result).toBeInstanceOf(Polyanet);
  });

  it('should map "$color_SOLOON" -> Soloon', () => {
    const colors = ['WHITE', 'BLUE'];
    colors.forEach((color) => {
      const result = AstralMapper.mapFromGoal(`${color}_SOLOON`);
      expect(result).toBeInstanceOf(Soloon);
      expect((result as Soloon).color).toBe(color.toLowerCase());
    });
  });

  it('should map "$direction_COMETH" -> Cometh', () => {
    const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    directions.forEach((direction) => {
      const result = AstralMapper.mapFromGoal(`${direction}_COMETH`);
      expect(result).toBeInstanceOf(Cometh);
      expect((result as Cometh).direction).toBe(direction.toLowerCase());
    });
  });

  it('should throw an error for unknown input', () => {
    expect(() => AstralMapper.mapFromGoal('donut')).toThrow(
      'Unknown input type: donut',
    );
  });
});
