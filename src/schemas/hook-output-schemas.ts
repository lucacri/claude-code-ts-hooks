/**
 * Zod schemas for runtime validation of hook outputs
 */

import { z } from 'zod';

/**
 * Base hook output schema
 */
export const BaseHookOutputSchema = z.object({
  continue: z.boolean().optional(),
  stopReason: z.string().optional(),
  suppressOutput: z.boolean().optional(),
}).passthrough();

/**
 * Hook decision schema
 */
export const HookDecisionSchema = z.enum(['approve', 'block']);

/**
 * PreToolUse hook output schema
 */
export const PreToolUseHookOutputSchema = BaseHookOutputSchema.extend({
  decision: HookDecisionSchema.optional(),
  reason: z.string().optional(),
}).passthrough();

/**
 * PostToolUse hook output schema
 */
export const PostToolUseHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
}).passthrough();

/**
 * Stop hook output schema
 */
export const StopHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
}).passthrough();

/**
 * Notification hook output schema
 */
export const NotificationHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.undefined().optional(),
}).passthrough();

/**
 * SubagentStop hook output schema
 */
export const SubagentStopHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
}).passthrough();

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
}).passthrough();

/**
 * PreCompact hook output schema
 */
export const PreCompactHookOutputSchema = BaseHookOutputSchema.extend({
  decision: z.enum(['approve', 'block']).optional(),
  reason: z.string().optional(),
}).passthrough();

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
]).passthrough();
