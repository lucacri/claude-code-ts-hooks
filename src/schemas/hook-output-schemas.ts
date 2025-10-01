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
  SessionStartHookOutput,
  SessionEndHookOutput,
  HookOutput,
} from '../types/index.ts';

type HookOutputObjectSchema<Shape extends z.ZodRawShape> = z.ZodObject<Shape>;

type BaseHookOutputShape = {
  continue: z.ZodOptional<z.ZodBoolean>;
  stopReason: z.ZodOptional<z.ZodString>;
  suppressOutput: z.ZodOptional<z.ZodBoolean>;
  systemMessage: z.ZodOptional<z.ZodString>;
};

const baseHookOutputShape: BaseHookOutputShape = {
  continue: z.boolean().optional(),
  stopReason: z.string().optional(),
  suppressOutput: z.boolean().optional(),
  systemMessage: z.string().optional(),
};

export const BaseHookOutputSchema: HookOutputObjectSchema<BaseHookOutputShape> = z.object(baseHookOutputShape) satisfies z.ZodType<BaseHookOutput>;

export const HookDecisionSchema: z.ZodType<HookDecision> =
  z.enum(['approve', 'block']) satisfies z.ZodType<HookDecision>;

/** @internal */
const preToolUseHookSpecificOutputSchema: z.ZodObject<{
  hookEventName: z.ZodLiteral<'PreToolUse'>;
  permissionDecision: z.ZodOptional<z.ZodEnum<['allow', 'deny', 'ask']>>;
  permissionDecisionReason: z.ZodOptional<z.ZodString>;
}> = z.object({
  hookEventName: z.literal('PreToolUse'),
  permissionDecision: z.enum(['allow', 'deny', 'ask']).optional(),
  permissionDecisionReason: z.string().optional(),
});

type PreToolUseHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<typeof HookDecisionSchema>;
  reason: z.ZodOptional<z.ZodString>;
  hookSpecificOutput: z.ZodOptional<typeof preToolUseHookSpecificOutputSchema>;
};

const preToolUseHookOutputShape: PreToolUseHookOutputShape = {
  ...baseHookOutputShape,
  decision: HookDecisionSchema.optional(),
  reason: z.string().optional(),
  hookSpecificOutput: preToolUseHookSpecificOutputSchema.optional(),
};

export const PreToolUseHookOutputSchema: HookOutputObjectSchema<PreToolUseHookOutputShape> = z.object(preToolUseHookOutputShape) satisfies z.ZodType<PreToolUseHookOutput>;

type BlockDecisionShape = z.ZodLiteral<'block'>;

const postToolUseHookSpecificOutputSchema: z.ZodObject<{
  hookEventName: z.ZodLiteral<'PostToolUse'>;
  additionalContext: z.ZodOptional<z.ZodString>;
}> = z.object({
  hookEventName: z.literal('PostToolUse'),
  additionalContext: z.string().optional(),
});

type PostToolUseHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<BlockDecisionShape>;
  reason: z.ZodOptional<z.ZodString>;
  hookSpecificOutput: z.ZodOptional<typeof postToolUseHookSpecificOutputSchema>;
};

const postToolUseHookOutputShape: PostToolUseHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
  hookSpecificOutput: postToolUseHookSpecificOutputSchema.optional(),
};

export const PostToolUseHookOutputSchema: HookOutputObjectSchema<PostToolUseHookOutputShape> =
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

export const StopHookOutputSchema: HookOutputObjectSchema<StopHookOutputShape> = z.object(stopHookOutputShape) satisfies z.ZodType<StopHookOutput>;

type NotificationHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<z.ZodUndefined>;
};

const notificationHookOutputShape: NotificationHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.undefined().optional(),
};

export const NotificationHookOutputSchema: HookOutputObjectSchema<NotificationHookOutputShape> =
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

export const SubagentStopHookOutputSchema: HookOutputObjectSchema<SubagentStopHookOutputShape> =
  z.object(subagentStopHookOutputShape) satisfies z.ZodType<SubagentStopHookOutput>;

const userPromptSubmitHookSpecificOutputSchema: z.ZodObject<{
  hookEventName: z.ZodLiteral<'UserPromptSubmit'>;
  additionalContext: z.ZodOptional<z.ZodString>;
}> = z.object({
  hookEventName: z.literal('UserPromptSubmit'),
  additionalContext: z.string().optional(),
});

type UserPromptSubmitHookOutputShape = BaseHookOutputShape & {
  decision: z.ZodOptional<BlockDecisionShape>;
  reason: z.ZodOptional<z.ZodString>;
  hookSpecificOutput: z.ZodOptional<typeof userPromptSubmitHookSpecificOutputSchema>;
};

const userPromptSubmitHookOutputShape: UserPromptSubmitHookOutputShape = {
  ...baseHookOutputShape,
  decision: z.literal('block').optional(),
  reason: z.string().optional(),
  hookSpecificOutput: userPromptSubmitHookSpecificOutputSchema.optional(),
};

export const UserPromptSubmitHookOutputSchema: HookOutputObjectSchema<UserPromptSubmitHookOutputShape> =
  z.object(userPromptSubmitHookOutputShape) satisfies z.ZodType<UserPromptSubmitHookOutput>;

type PreCompactHookOutputShape = BaseHookOutputShape;

const preCompactHookOutputShape: PreCompactHookOutputShape = {
  ...baseHookOutputShape,
};

export const PreCompactHookOutputSchema: HookOutputObjectSchema<PreCompactHookOutputShape> =
  z.object(preCompactHookOutputShape) satisfies z.ZodType<PreCompactHookOutput>;

const sessionStartHookSpecificOutputSchema: z.ZodObject<{
  hookEventName: z.ZodLiteral<'SessionStart'>;
  additionalContext: z.ZodOptional<z.ZodString>;
}> = z.object({
  hookEventName: z.literal('SessionStart'),
  additionalContext: z.string().optional(),
});

type SessionStartHookOutputShape = BaseHookOutputShape & {
  hookSpecificOutput: z.ZodOptional<typeof sessionStartHookSpecificOutputSchema>;
};

const sessionStartHookOutputShape: SessionStartHookOutputShape = {
  ...baseHookOutputShape,
  hookSpecificOutput: sessionStartHookSpecificOutputSchema.optional(),
};

export const SessionStartHookOutputSchema: HookOutputObjectSchema<SessionStartHookOutputShape> =
  z.object(sessionStartHookOutputShape) satisfies z.ZodType<SessionStartHookOutput>;

type SessionEndHookOutputShape = BaseHookOutputShape;

const sessionEndHookOutputShape: SessionEndHookOutputShape = {
  ...baseHookOutputShape,
};

export const SessionEndHookOutputSchema: HookOutputObjectSchema<SessionEndHookOutputShape> =
  z.object(sessionEndHookOutputShape) satisfies z.ZodType<SessionEndHookOutput>;

export const HookOutputSchema: z.ZodType<HookOutput> =
  z.union([
    PreToolUseHookOutputSchema,
    PostToolUseHookOutputSchema,
    NotificationHookOutputSchema,
    StopHookOutputSchema,
    SubagentStopHookOutputSchema,
    UserPromptSubmitHookOutputSchema,
    PreCompactHookOutputSchema,
    SessionStartHookOutputSchema,
    SessionEndHookOutputSchema,
  ]) satisfies z.ZodType<HookOutput>;
