import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { StateMapper } from './state-item-mapper.js';
import { Cometh, Polyanet, Soloon, Space } from '../entities/astral-item.js';

describe('StateMapper', () => {
  describe('mapFromGoalState', () => {
    it('should map "SPACE" -> Space', () => {
      const result = StateMapper.mapFromGoalState('SPACE');
      expect(result).toBeInstanceOf(Space);
    });

    it('should map "POLYANET" -> Polyanet', () => {
      const result = StateMapper.mapFromGoalState('POLYANET');
      expect(result).toBeInstanceOf(Polyanet);
    });

    it('should map "$color_SOLOON" -> Soloon', () => {
      const colors = ['WHITE', 'BLUE'];
      colors.forEach((color) => {
        const result = StateMapper.mapFromGoalState(`${color}_SOLOON`);
        expect(result).toBeInstanceOf(Soloon);
        expect((result as Soloon).color).toBe(color.toLowerCase());
      });
    });

    it('should map "$direction_COMETH" -> Cometh', () => {
      const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      directions.forEach((direction) => {
        const result = StateMapper.mapFromGoalState(`${direction}_COMETH`);
        expect(result).toBeInstanceOf(Cometh);
        expect((result as Cometh).direction).toBe(direction.toLowerCase());
      });
    });

    it('should throw an error for unknown input', () => {
      expect(() => StateMapper.mapFromGoalState('donut')).toThrow(
        'Unknown input type: donut',
      );
    });
  });

  describe('mapFromCurrentState', () => {
    it('should map null -> Space', () => {
      const result = StateMapper.mapFromCurrentState(null);
      expect(result).toBeInstanceOf(Space);
    });

    it('should map { type: 0 } -> Polyanet', () => {
      const result = StateMapper.mapFromCurrentState({ type: 0 });
      expect(result).toBeInstanceOf(Polyanet);
    });

    it('should map { type: 1, color: $color } -> Soloon', () => {
      const colors = ['white', 'blue'];
      colors.forEach((color) => {
        const result = StateMapper.mapFromCurrentState({
          type: 1,
          color,
        });
        expect(result).toBeInstanceOf(Soloon);
        expect((result as Soloon).color).toBe(color);
      });
    });

    it('should map { type: 2, direction: $direction } -> Cometh', () => {
      const directions = ['up', 'down', 'left', 'right'];
      directions.forEach((direction) => {
        const result = StateMapper.mapFromCurrentState({
          type: 2,
          direction,
        });
        expect(result).toBeInstanceOf(Cometh);
        expect((result as Cometh).direction).toBe(direction);
      });
    });

    it('should throw an error for unknown input', () => {
      expect(() =>
        StateMapper.mapFromCurrentState({ type: 99 } as any),
      ).toThrow('Unknown input type: [object Object]');
    });
  });
});
