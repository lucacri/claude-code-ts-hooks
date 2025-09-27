/**
 * Zod schemas for runtime validation of hook outputs
 */

import { z } from 'zod';
import type {
  BaseHookOutput,
  HookDecision,
  PreToolUseHookOutput,
  PostToolUseHookOutput,
  StopHookOutput,
  NotificationHookOutput,
  SubagentStopHookOutput,
  UserPromptSubmitHookOutput,
  PreCompactHookOutput,
  HookOutput,
} from '../types/index.ts';

/**
 * Base hook output schema
 */
export const BaseHookOutputSchema = z.object({
  continue: z.boolean().optional(),
  stopReason: z.string().optional(),
  suppressOutput: z.boolean().optional(),
}) satisfies z.ZodType<BaseHookOutput>;

/**
 * Hook decision schema
 */
export const HookDecisionSchema = z.enum(['approve', 'block']) satisfies z.ZodType<HookDecision>;

/**
 * PreToolUse hook output schema
 */
export const PreToolUseHookOutputSchema = BaseHookOutputSchema.extend({
  decision: HookDecisionSchema.optional(),
  reason: z.string().optional(),
}) satisfies z.ZodType<PreToolUseHookOutput>;

/**
 * PostToolUse hook output schema
 */
export const PostToolUseHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
}) satisfies z.ZodType<PostToolUseHookOutput>;

/**
 * Stop hook output schema
 */
export const StopHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
}) satisfies z.ZodType<StopHookOutput>;

/**
 * Notification hook output schema
 */
export const NotificationHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.undefined().optional(),
}) satisfies z.ZodType<NotificationHookOutput>;

/**
 * SubagentStop hook output schema
 */
export const SubagentStopHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
}) satisfies z.ZodType<SubagentStopHookOutput>;

/**
 * UserPromptSubmit hook output schema
 */
export const UserPromptSubmitHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.enum(['approve', 'block']).optional(),
  reason: z.string().optional(),
  contextFiles: z.array(z.string()).optional(),
  updatedPrompt: z.string().optional(),
  hookSpecificOutput: z.object({
    hookEventName: z.string(),
    additionalContext: z.string(),
  }).optional(),
}) satisfies z.ZodType<UserPromptSubmitHookOutput>;

/**
 * PreCompact hook output schema
 */
export const PreCompactHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.enum(['approve', 'block']).optional(),
  reason: z.string().optional(),
}) satisfies z.ZodType<PreCompactHookOutput>;

/**
 * Union schema for all hook outputs
 */
export const HookOutputSchema = z.union([
  PreToolUseHookOutputSchema,
  PostToolUseHookOutputSchema,
  NotificationHookOutputSchema,
  StopHookOutputSchema,
  SubagentStopHookOutputSchema,
  UserPromptSubmitHookOutputSchema,
  PreCompactHookOutputSchema,
]) satisfies z.ZodType<HookOutput>;
