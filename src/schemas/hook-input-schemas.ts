/**
 * Zod schemas for runtime validation of hook inputs
 */

import { z } from 'zod';
import { HookEventName } from '../types/base.js';

/**
 * Base hook input schema
 */
export const BaseHookInputSchema = z.object({
  session_id: z.string(),
  transcript_path: z.string(),
  hook_event_name: z.string(),
}).passthrough();

/**
 * Tool input/output schemas
 */
export const ToolInputSchema = z.record(z.string(), z.unknown());
export const ToolResponseSchema = z.record(z.string(), z.unknown());

/**
 * PreToolUse hook input schema
 */
export const PreToolUseHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.PreToolUse),
  tool_name: z.string(),
  tool_input: ToolInputSchema,
}).passthrough();

/**
 * PostToolUse hook input schema
 */
export const PostToolUseHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.PostToolUse),
  tool_name: z.string(),
  tool_input: ToolInputSchema,
  tool_response: ToolResponseSchema,
}).passthrough();

/**
 * Notification hook input schema
 */
export const NotificationHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.Notification),
  message: z.string(),
}).passthrough();

/**
 * Stop hook input schema
 */
export const StopHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.Stop),
  stop_hook_active: z.boolean(),
}).passthrough();

/**
 * SubagentStop hook input schema
 */
export const SubagentStopHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.SubagentStop),
  stop_hook_active: z.boolean(),
}).passthrough();

/**
 * UserPromptSubmit hook input schema
 */
export const UserPromptSubmitHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.UserPromptSubmit),
  prompt: z.string(),
}).passthrough();

/**
 * PreCompact hook input schema
 */
export const PreCompactHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.PreCompact),
  trigger: z.string(),
  custom_instructions: z.string(),
}).passthrough();

/**
 * Discriminated union schema for all hook inputs
 */
export const HookInputSchema = z.discriminatedUnion('hook_event_name', [
  PreToolUseHookInputSchema,
  PostToolUseHookInputSchema,
  NotificationHookInputSchema,
  StopHookInputSchema,
  SubagentStopHookInputSchema,
  UserPromptSubmitHookInputSchema,
  PreCompactHookInputSchema,
]).passthrough();

/**
 * Hook event name schema
 */
export const HookEventNameSchema = z.nativeEnum(HookEventName);
