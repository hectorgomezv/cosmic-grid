import z from 'zod';
import type { AstralItem } from './astral-item.js';
import type { Position } from './position.js';

const AstralObjectStrSchema = z.union([
  z.literal('SPACE'),
  z.literal('POLYANET'),
  z.enum(['UP_COMETH', 'DOWN_COMETH', 'LEFT_COMETH', 'RIGHT_COMETH']),
  z.enum(['BLUE_SOLOON', 'PURPLE_SOLOON', 'RED_SOLOON', 'WHITE_SOLOON']),
]);

export const GoalResponseSchema = z.object({
  goal: z.array(z.array(AstralObjectStrSchema)),
});

export type GoalResponse = z.infer<typeof GoalResponseSchema>;

export type Goal = Array<AstralItem & Position>;
