/**
 * Claude Code TypeScript Hooks
 * 
 * Provides comprehensive TypeScript types and utilities for Claude Code hooks,
 * enabling type-safe hook implementations with runtime validation.
 * 
 * @example Basic usage:
 * ```typescript
 * import { runHook, type HookHandlers } from 'claude-code-ts-hooks';
 * 
 * const handlers: HookHandlers = {
 *   preToolUse: async (payload) => {
 *     console.log(`About to use tool: ${payload.tool_name}`);
 *     return { decision: 'approve' };
 *   },
 *   
 *   stop: async (payload) => {
 *     console.log('Task completed!');
 *     return {};
 *   }
 * };
 * 
 * runHook(handlers);
 * ```
 */

// Export the main hook runner
export { runHook, log } from './run-hook.ts';

// Export simple types
export type {
  // Payload types
  BaseHookPayload,
  PreToolUsePayload,
  PostToolUsePayload,
  NotificationPayload,
  StopPayload,
  SubagentStopPayload,
  UserPromptSubmitPayload,
  PreCompactPayload,
  SessionStartPayload,
  HookPayload,
} from './types/hook-payloads.ts';

// Export response types
export type {
  BaseHookResponse,
  PreToolUseResponse,
  PostToolUseResponse,
  StopResponse,
  UserPromptSubmitResponse,
  PreCompactResponse,
  SessionStartResponse,
  HookResponse,
} from './types/hook-responses.ts';

// Export handler types
export type {
  PreToolUseHandler,
  PostToolUseHandler,
  NotificationHandler,
  StopHandler,
  SubagentStopHandler,
  UserPromptSubmitHandler,
  PreCompactHandler,
  SessionStartHandler,
  HookHandlers,
} from './types/hook-handlers.ts';

// Export validation utilities (keep the useful parts)
export * from './utils/index.ts';
export * from './schemas/index.ts';

// Package version and metadata
export const VERSION = '1.1.2';
export const PACKAGE_NAME = 'claude-code-ts-hooks';
