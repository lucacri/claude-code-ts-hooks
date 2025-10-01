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
  SessionStartHookInput,
  SessionEndHookInput,
  HookInput,
} from '../types/index.ts';

type HookObjectSchema<Shape extends z.ZodRawShape> = z.ZodObject<Shape>;

type BaseHookInputShape = {
  session_id: z.ZodString;
  transcript_path: z.ZodString;
  hook_event_name: z.ZodString;
};

const baseHookInputShape: BaseHookInputShape = {
  session_id: z.string(),
  transcript_path: z.string(),
  hook_event_name: z.string(),
};

export const BaseHookInputSchema: HookObjectSchema<BaseHookInputShape> =
  z.object(baseHookInputShape) satisfies z.ZodType<BaseHookInput>;

export const ToolInputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown> =
  z.record(z.string(), z.unknown()) satisfies z.ZodType<ToolInput>;

export const ToolResponseSchema: z.ZodRecord<z.ZodString, z.ZodUnknown> =
  z.record(z.string(), z.unknown()) satisfies z.ZodType<ToolResponse>;

type PreToolUseHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.PreToolUse>;
  cwd: z.ZodString;
  tool_name: z.ZodString;
  tool_input: typeof ToolInputSchema;
};

const preToolUseHookInputShape: PreToolUseHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.PreToolUse),
  cwd: z.string(),
  tool_name: z.string(),
  tool_input: ToolInputSchema,
};

export const PreToolUseHookInputSchema: HookObjectSchema<PreToolUseHookInputShape> =
  z.object(preToolUseHookInputShape) satisfies z.ZodType<PreToolUseHookInput>;

type PostToolUseHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.PostToolUse>;
  cwd: z.ZodString;
  tool_name: z.ZodString;
  tool_input: typeof ToolInputSchema;
  tool_response: typeof ToolResponseSchema;
};

const postToolUseHookInputShape: PostToolUseHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.PostToolUse),
  cwd: z.string(),
  tool_name: z.string(),
  tool_input: ToolInputSchema,
  tool_response: ToolResponseSchema,
};

export const PostToolUseHookInputSchema: HookObjectSchema<PostToolUseHookInputShape> =
  z.object(postToolUseHookInputShape) satisfies z.ZodType<PostToolUseHookInput>;

type NotificationHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.Notification>;
  cwd: z.ZodString;
  message: z.ZodString;
};

const notificationHookInputShape: NotificationHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.Notification),
  cwd: z.string(),
  message: z.string(),
};

export const NotificationHookInputSchema: HookObjectSchema<NotificationHookInputShape> =
  z.object(notificationHookInputShape) satisfies z.ZodType<NotificationHookInput>;

type StopHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.Stop>;
  stop_hook_active: z.ZodBoolean;
};

const stopHookInputShape: StopHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.Stop),
  stop_hook_active: z.boolean(),
};

export const StopHookInputSchema: HookObjectSchema<StopHookInputShape> = z.object(stopHookInputShape) satisfies z.ZodType<StopHookInput>;

type SubagentStopHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.SubagentStop>;
  stop_hook_active: z.ZodBoolean;
};

const subagentStopHookInputShape: SubagentStopHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.SubagentStop),
  stop_hook_active: z.boolean(),
};

export const SubagentStopHookInputSchema: HookObjectSchema<SubagentStopHookInputShape> =
  z.object(subagentStopHookInputShape) satisfies z.ZodType<SubagentStopHookInput>;

type UserPromptSubmitHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.UserPromptSubmit>;
  cwd: z.ZodString;
  prompt: z.ZodString;
};

const userPromptSubmitHookInputShape: UserPromptSubmitHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.UserPromptSubmit),
  cwd: z.string(),
  prompt: z.string(),
};

export const UserPromptSubmitHookInputSchema: HookObjectSchema<UserPromptSubmitHookInputShape> =
  z.object(userPromptSubmitHookInputShape) satisfies z.ZodType<UserPromptSubmitHookInput>;

type PreCompactHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.PreCompact>;
  trigger: z.ZodString;
  custom_instructions: z.ZodString;
};

const preCompactHookInputShape: PreCompactHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.PreCompact),
  trigger: z.string(),
  custom_instructions: z.string(),
};

export const PreCompactHookInputSchema: HookObjectSchema<PreCompactHookInputShape> = z.object(preCompactHookInputShape) satisfies z.ZodType<PreCompactHookInput>;

/** @internal */
const sessionStartHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.SessionStart),
  source: z.enum(['startup', 'resume', 'clear', 'compact']),
};

type SessionStartHookInputShape = typeof sessionStartHookInputShape;

export const SessionStartHookInputSchema: HookObjectSchema<SessionStartHookInputShape> = z.object(sessionStartHookInputShape) satisfies z.ZodType<SessionStartHookInput>;

/** @internal */
const sessionEndHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.SessionEnd),
  cwd: z.string(),
  reason: z.enum(['clear', 'logout', 'prompt_input_exit', 'other']),
};

type SessionEndHookInputShape = typeof sessionEndHookInputShape;

export const SessionEndHookInputSchema: HookObjectSchema<SessionEndHookInputShape> = z.object(sessionEndHookInputShape) satisfies z.ZodType<SessionEndHookInput>;

export const HookInputSchema: z.ZodType<HookInput> =
  z.discriminatedUnion('hook_event_name', [
    PreToolUseHookInputSchema,
    PostToolUseHookInputSchema,
    NotificationHookInputSchema,
    StopHookInputSchema,
    SubagentStopHookInputSchema,
    UserPromptSubmitHookInputSchema,
    PreCompactHookInputSchema,
    SessionStartHookInputSchema,
    SessionEndHookInputSchema,
  ]) satisfies z.ZodType<HookInput>;

export const HookEventNameSchema: z.ZodType<HookEventName> =
  z.nativeEnum(HookEventName) satisfies z.ZodType<HookEventName>;
