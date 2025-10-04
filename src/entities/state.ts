import z from 'zod';
import type { AstralItem } from './astral-item.js';
import type { Position } from './position.js';

const GoalStateItemSchema = z.union([
  z.literal('SPACE'),
  z.literal('POLYANET'),
  z.enum(['UP_COMETH', 'DOWN_COMETH', 'LEFT_COMETH', 'RIGHT_COMETH']),
  z.enum(['BLUE_SOLOON', 'PURPLE_SOLOON', 'RED_SOLOON', 'WHITE_SOLOON']),
]);

export const GoalStateResponseSchema = z.object({
  goal: z.array(z.array(GoalStateItemSchema)),
});

const CurrentStateItemSchema = z.union([
  z.null(),
  z.object({
    type: z.number(),
    color: z.string(),
  }),
  z.object({
    type: z.number(),
    direction: z.string(),
  }),
  z.object({
    type: z.number(),
  }),
]);

export const CurrentStateResponseSchema = z.object({
  map: z.object({
    content: z.array(z.array(CurrentStateItemSchema)),
  }),
});

export type GoalStateResponse = z.infer<typeof GoalStateResponseSchema>;
export type CurrentStateResponse = z.infer<typeof CurrentStateResponseSchema>;
export type State = Array<AstralItem & Position>;
