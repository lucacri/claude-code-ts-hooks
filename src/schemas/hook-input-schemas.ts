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

type HookObjectSchema<Shape extends z.ZodRawShape, Output> = z.ZodObject<
  Shape,
  'strip',
  z.ZodTypeAny,
  Output,
  Output
>;

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

export const BaseHookInputSchema: HookObjectSchema<
  BaseHookInputShape,
  BaseHookInput
> = z.object(baseHookInputShape) satisfies z.ZodType<BaseHookInput>;

export const ToolInputSchema: z.ZodRecord<z.ZodString, z.ZodUnknown> =
  z.record(z.string(), z.unknown()) satisfies z.ZodType<ToolInput>;

export const ToolResponseSchema: z.ZodRecord<z.ZodString, z.ZodUnknown> =
  z.record(z.string(), z.unknown()) satisfies z.ZodType<ToolResponse>;

type PreToolUseHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.PreToolUse>;
  tool_name: z.ZodString;
  tool_input: typeof ToolInputSchema;
};

const preToolUseHookInputShape: PreToolUseHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.PreToolUse),
  tool_name: z.string(),
  tool_input: ToolInputSchema,
};

export const PreToolUseHookInputSchema: HookObjectSchema<
  PreToolUseHookInputShape,
  PreToolUseHookInput
> = z.object(preToolUseHookInputShape) satisfies z.ZodType<PreToolUseHookInput>;

type PostToolUseHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.PostToolUse>;
  tool_name: z.ZodString;
  tool_input: typeof ToolInputSchema;
  tool_response: typeof ToolResponseSchema;
};

const postToolUseHookInputShape: PostToolUseHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.PostToolUse),
  tool_name: z.string(),
  tool_input: ToolInputSchema,
  tool_response: ToolResponseSchema,
};

export const PostToolUseHookInputSchema: HookObjectSchema<
  PostToolUseHookInputShape,
  PostToolUseHookInput
> =
  z.object(postToolUseHookInputShape) satisfies z.ZodType<PostToolUseHookInput>;

type NotificationHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.Notification>;
  message: z.ZodString;
};

const notificationHookInputShape: NotificationHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.Notification),
  message: z.string(),
};

export const NotificationHookInputSchema: HookObjectSchema<
  NotificationHookInputShape,
  NotificationHookInput
> =
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

export const StopHookInputSchema: HookObjectSchema<
  StopHookInputShape,
  StopHookInput
> = z.object(stopHookInputShape) satisfies z.ZodType<StopHookInput>;

type SubagentStopHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.SubagentStop>;
  stop_hook_active: z.ZodBoolean;
};

const subagentStopHookInputShape: SubagentStopHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.SubagentStop),
  stop_hook_active: z.boolean(),
};

export const SubagentStopHookInputSchema: HookObjectSchema<
  SubagentStopHookInputShape,
  SubagentStopHookInput
> =
  z.object(subagentStopHookInputShape) satisfies z.ZodType<SubagentStopHookInput>;

type UserPromptSubmitHookInputShape = Omit<BaseHookInputShape, 'hook_event_name'> & {
  hook_event_name: z.ZodLiteral<HookEventName.UserPromptSubmit>;
  prompt: z.ZodString;
};

const userPromptSubmitHookInputShape: UserPromptSubmitHookInputShape = {
  ...baseHookInputShape,
  hook_event_name: z.literal(HookEventName.UserPromptSubmit),
  prompt: z.string(),
};

export const UserPromptSubmitHookInputSchema: HookObjectSchema<
  UserPromptSubmitHookInputShape,
  UserPromptSubmitHookInput
> =
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

export const PreCompactHookInputSchema: HookObjectSchema<
  PreCompactHookInputShape,
  PreCompactHookInput
> = z.object(preCompactHookInputShape) satisfies z.ZodType<PreCompactHookInput>;

export const HookInputSchema: z.ZodDiscriminatedUnion<
  'hook_event_name',
  [
    HookObjectSchema<PreToolUseHookInputShape, PreToolUseHookInput>,
    HookObjectSchema<PostToolUseHookInputShape, PostToolUseHookInput>,
    HookObjectSchema<NotificationHookInputShape, NotificationHookInput>,
    HookObjectSchema<StopHookInputShape, StopHookInput>,
    HookObjectSchema<SubagentStopHookInputShape, SubagentStopHookInput>,
    HookObjectSchema<UserPromptSubmitHookInputShape, UserPromptSubmitHookInput>,
    HookObjectSchema<PreCompactHookInputShape, PreCompactHookInput>,
  ]
> =
  z.discriminatedUnion('hook_event_name', [
    PreToolUseHookInputSchema,
    PostToolUseHookInputSchema,
    NotificationHookInputSchema,
    StopHookInputSchema,
    SubagentStopHookInputSchema,
    UserPromptSubmitHookInputSchema,
    PreCompactHookInputSchema,
  ]) satisfies z.ZodType<HookInput>;

export const HookEventNameSchema: z.ZodNativeEnum<typeof HookEventName> =
  z.nativeEnum(HookEventName) satisfies z.ZodType<HookEventName>;
