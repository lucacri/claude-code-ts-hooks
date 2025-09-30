/**
 * Simple hook handler types following the reference implementation
 */

import type {
  PreToolUsePayload,
  PostToolUsePayload,
  NotificationPayload,
  StopPayload,
  SubagentStopPayload,
  UserPromptSubmitPayload,
  PreCompactPayload,
  SessionStartPayload,
  SessionEndPayload,
} from './hook-payloads.ts'

import type {
  PreToolUseResponse,
  PostToolUseResponse,
  BaseHookResponse,
  StopResponse,
  UserPromptSubmitResponse,
  PreCompactResponse,
  SessionStartResponse,
  SessionEndResponse,
} from './hook-responses.ts'

// Simple handler types
export type PreToolUseHandler = (payload: PreToolUsePayload) => Promise<PreToolUseResponse> | PreToolUseResponse
export type PostToolUseHandler = (payload: PostToolUsePayload) => Promise<PostToolUseResponse> | PostToolUseResponse
export type NotificationHandler = (payload: NotificationPayload) => Promise<BaseHookResponse> | BaseHookResponse
export type StopHandler = (payload: StopPayload) => Promise<StopResponse> | StopResponse
export type SubagentStopHandler = (payload: SubagentStopPayload) => Promise<StopResponse> | StopResponse
export type UserPromptSubmitHandler = (
  payload: UserPromptSubmitPayload,
) => Promise<UserPromptSubmitResponse> | UserPromptSubmitResponse
export type PreCompactHandler = (payload: PreCompactPayload) => Promise<PreCompactResponse> | PreCompactResponse
export type SessionStartHandler = (payload: SessionStartPayload) => Promise<SessionStartResponse> | SessionStartResponse
export type SessionEndHandler = (payload: SessionEndPayload) => Promise<SessionEndResponse> | SessionEndResponse

// Main handlers interface
export interface HookHandlers {
  preToolUse?: PreToolUseHandler
  postToolUse?: PostToolUseHandler
  notification?: NotificationHandler
  stop?: StopHandler
  subagentStop?: SubagentStopHandler
  userPromptSubmit?: UserPromptSubmitHandler
  preCompact?: PreCompactHandler
  sessionStart?: SessionStartHandler
  sessionEnd?: SessionEndHandler
}
