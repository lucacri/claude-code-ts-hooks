/**
 * Zod schemas for runtime validation of hook inputs
 */

import { z } from 'zod';
import { HookEventName } from '../types/base.ts';
import type {
  BaseHookInput,
  ToolInput,
  ToolResponse,
  PreToolUseHookInput,
  PostToolUseHookInput,
  NotificationHookInput,
  StopHookInput,
  SubagentStopHookInput,
  UserPromptSubmitHookInput,
  PreCompactHookInput,
  HookInput,
} from '../types/index.ts';

/**
 * Base hook input schema
 */
export const BaseHookInputSchema = z.object({
  session_id: z.string(),
  transcript_path: z.string(),
  hook_event_name: z.string(),
}) satisfies z.ZodType<BaseHookInput>;

/**
 * Tool input/output schemas
 */
export const ToolInputSchema = z.record(z.string(), z.unknown()) satisfies z.ZodType<ToolInput>;
export const ToolResponseSchema = z.record(z.string(), z.unknown()) satisfies z.ZodType<ToolResponse>;

/**
 * PreToolUse hook input schema
 */
export const PreToolUseHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.PreToolUse),
  tool_name: z.string(),
  tool_input: ToolInputSchema,
}) satisfies z.ZodType<PreToolUseHookInput>;

/**
 * PostToolUse hook input schema
 */
export const PostToolUseHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.PostToolUse),
  tool_name: z.string(),
  tool_input: ToolInputSchema,
  tool_response: ToolResponseSchema,
}) satisfies z.ZodType<PostToolUseHookInput>;

/**
 * Notification hook input schema
 */
export const NotificationHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.Notification),
  message: z.string(),
}) satisfies z.ZodType<NotificationHookInput>;

/**
 * Stop hook input schema
 */
export const StopHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.Stop),
  stop_hook_active: z.boolean(),
}) satisfies z.ZodType<StopHookInput>;

/**
 * SubagentStop hook input schema
 */
export const SubagentStopHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.SubagentStop),
  stop_hook_active: z.boolean(),
}) satisfies z.ZodType<SubagentStopHookInput>;

/**
 * UserPromptSubmit hook input schema
 */
export const UserPromptSubmitHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.UserPromptSubmit),
  prompt: z.string(),
}) satisfies z.ZodType<UserPromptSubmitHookInput>;

/**
 * PreCompact hook input schema
 */
export const PreCompactHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal(HookEventName.PreCompact),
  trigger: z.string(),
  custom_instructions: z.string(),
}) satisfies z.ZodType<PreCompactHookInput>;

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
]) satisfies z.ZodType<HookInput>;

/**
 * Hook event name schema
 */
export const HookEventNameSchema = z.nativeEnum(HookEventName) satisfies z.ZodType<HookEventName>;
