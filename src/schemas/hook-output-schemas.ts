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

type HookOutputObjectSchema<Shape extends z.ZodRawShape, Output> = z.ZodObject<
  Shape,
  'strip',
  z.ZodTypeAny,
  Output,
  Output
>;

type BaseHookOutputShape = {
  continue: z.ZodOptional<z.ZodBoolean>;
  stopReason: z.ZodOptional<z.ZodString>;
  suppressOutput: z.ZodOptional<z.ZodBoolean>;
};

const baseHookOutputShape: BaseHookOutputShape = {
  continue: z.boolean().optional(),
  stopReason: z.string().optional(),
  suppressOutput: z.boolean().optional(),
};

export const BaseHookOutputSchema: HookOutputObjectSchema<
  BaseHookOutputShape,
  BaseHookOutput
> = z.object(baseHookOutputShape) satisfies z.ZodType<BaseHookOutput>;

export const HookDecisionSchema: z.ZodEnum<['approve', 'block']> =
  z.enum(['approve', 'block']) satisfies z.ZodType<HookDecision>;

type PreToolUseHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<typeof HookDecisionSchema>;
  reason: z.ZodOptional<z.ZodString>;
};

const preToolUseHookOutputShape: PreToolUseHookOutputShape = {
  ...baseHookOutputShape,
  decision: HookDecisionSchema.optional(),
  reason: z.string().optional(),
};

export const PreToolUseHookOutputSchema: HookOutputObjectSchema<
  PreToolUseHookOutputShape,
  PreToolUseHookOutput
> = z.object(preToolUseHookOutputShape) satisfies z.ZodType<PreToolUseHookOutput>;

type BlockDecisionShape = z.ZodLiteral<'block'>;

type PostToolUseHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<BlockDecisionShape>;
  reason: z.ZodOptional<z.ZodString>;
};

const postToolUseHookOutputShape: PostToolUseHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
};

export const PostToolUseHookOutputSchema: HookOutputObjectSchema<
  PostToolUseHookOutputShape,
  PostToolUseHookOutput
> =
  z.object(postToolUseHookOutputShape) satisfies z.ZodType<PostToolUseHookOutput>;

type StopHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<BlockDecisionShape>;
  reason: z.ZodOptional<z.ZodString>;
};

const stopHookOutputShape: StopHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
};

export const StopHookOutputSchema: HookOutputObjectSchema<
  StopHookOutputShape,
  StopHookOutput
> = z.object(stopHookOutputShape) satisfies z.ZodType<StopHookOutput>;

type NotificationHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<z.ZodUndefined>;
};

const notificationHookOutputShape: NotificationHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.undefined().optional(),
};

export const NotificationHookOutputSchema: HookOutputObjectSchema<
  NotificationHookOutputShape,
  NotificationHookOutput
> =
  z.object(notificationHookOutputShape) satisfies z.ZodType<NotificationHookOutput>;

type SubagentStopHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<BlockDecisionShape>;
  reason: z.ZodOptional<z.ZodString>;
};

const subagentStopHookOutputShape: SubagentStopHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
};

export const SubagentStopHookOutputSchema: HookOutputObjectSchema<
  SubagentStopHookOutputShape,
  SubagentStopHookOutput
> =
  z.object(subagentStopHookOutputShape) satisfies z.ZodType<SubagentStopHookOutput>;

type HookSpecificOutputShape = {
  hookEventName: z.ZodString;
  additionalContext: z.ZodString;
};

const hookSpecificOutputShape: HookSpecificOutputShape = {
  hookEventName: z.string(),
  additionalContext: z.string(),
};

const hookSpecificOutputSchema: HookOutputObjectSchema<
  HookSpecificOutputShape,
  {
    hookEventName: string;
    additionalContext: string;
  }
> = z.object(hookSpecificOutputShape);

type UserPromptSubmitHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<z.ZodEnum<['approve', 'block']>>;
  reason: z.ZodOptional<z.ZodString>;
  contextFiles: z.ZodOptional<z.ZodArray<z.ZodString>>;
  updatedPrompt: z.ZodOptional<z.ZodString>;
  hookSpecificOutput: z.ZodOptional<typeof hookSpecificOutputSchema>;
};

const userPromptSubmitHookOutputShape: UserPromptSubmitHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.enum(['approve', 'block']).optional(),
  reason: z.string().optional(),
  contextFiles: z.array(z.string()).optional(),
  updatedPrompt: z.string().optional(),
  hookSpecificOutput: hookSpecificOutputSchema.optional(),
};

export const UserPromptSubmitHookOutputSchema: HookOutputObjectSchema<
  UserPromptSubmitHookOutputShape,
  UserPromptSubmitHookOutput
> =
  z.object(userPromptSubmitHookOutputShape) satisfies z.ZodType<UserPromptSubmitHookOutput>;

type PreCompactHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<z.ZodEnum<['approve', 'block']>>;
  reason: z.ZodOptional<z.ZodString>;
};

const preCompactHookOutputShape: PreCompactHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.enum(['approve', 'block']).optional(),
  reason: z.string().optional(),
};

export const PreCompactHookOutputSchema: HookOutputObjectSchema<
  PreCompactHookOutputShape,
  PreCompactHookOutput
> =
  z.object(preCompactHookOutputShape) satisfies z.ZodType<PreCompactHookOutput>;

export const HookOutputSchema: z.ZodUnion<
  [
    HookOutputObjectSchema<PreToolUseHookOutputShape, PreToolUseHookOutput>,
    HookOutputObjectSchema<PostToolUseHookOutputShape, PostToolUseHookOutput>,
    HookOutputObjectSchema<NotificationHookOutputShape, NotificationHookOutput>,
    HookOutputObjectSchema<StopHookOutputShape, StopHookOutput>,
    HookOutputObjectSchema<SubagentStopHookOutputShape, SubagentStopHookOutput>,
    HookOutputObjectSchema<UserPromptSubmitHookOutputShape, UserPromptSubmitHookOutput>,
    HookOutputObjectSchema<PreCompactHookOutputShape, PreCompactHookOutput>,
  ]
> =
  z.union([
    PreToolUseHookOutputSchema,
    PostToolUseHookOutputSchema,
    NotificationHookOutputSchema,
    StopHookOutputSchema,
    SubagentStopHookOutputSchema,
    UserPromptSubmitHookOutputSchema,
    PreCompactHookOutputSchema,
  ]) satisfies z.ZodType<HookOutput>;
