/**
 * Hook input type definitions for all Claude Code hook events
 */

import type { BaseHookInput, ToolInput, ToolResponse, HookEventName } from './base.ts';

/**
 * Input for PreToolUse hook - triggered before a tool is executed
 */
export interface PreToolUseHookInput extends BaseHookInput {
  hook_event_name: HookEventName.PreToolUse;
  /** The current working directory when the hook is invoked */
  cwd: string;
  /** Name of the tool about to be used */
  tool_name: string;
  /** Input parameters that will be passed to the tool */
  tool_input: ToolInput;
}

/**
 * Input for PostToolUse hook - triggered after a tool has been executed
 */
export interface PostToolUseHookInput extends BaseHookInput {
  hook_event_name: HookEventName.PostToolUse;
  /** The current working directory when the hook is invoked */
  cwd: string;
  /** Name of the tool that was used */
  tool_name: string;
  /** Input parameters that were passed to the tool */
  tool_input: ToolInput;
  /** Response data returned by the tool */
  tool_response: ToolResponse;
}

/**
 * Input for Notification hook - triggered when a notification is sent
 */
export interface NotificationHookInput extends BaseHookInput {
  hook_event_name: HookEventName.Notification;
  /** The current working directory when the hook is invoked */
  cwd: string;
  /** The notification message */
  message: string;
}

/**
 * Input for Stop hook - triggered when Claude finishes responding
 */
export interface StopHookInput extends BaseHookInput {
  hook_event_name: HookEventName.Stop;
  /** Whether the stop hook is currently active */
  stop_hook_active: boolean;
}

/**
 * Input for SubagentStop hook - triggered when a subagent stops
 */
export interface SubagentStopHookInput extends BaseHookInput {
  hook_event_name: HookEventName.SubagentStop;
  /** Whether the stop hook is currently active */
  stop_hook_active: boolean;
}

/**
 * Input for UserPromptSubmit hook - triggered when user submits a prompt
 */
export interface UserPromptSubmitHookInput extends BaseHookInput {
  hook_event_name: HookEventName.UserPromptSubmit;
  /** The current working directory when the hook is invoked */
  cwd: string;
  /** The user's prompt text */
  prompt: string;
}

/**
 * Input for PreCompact hook - triggered before conversation compaction
 */
export interface PreCompactHookInput extends BaseHookInput {
  hook_event_name: HookEventName.PreCompact;
  /** What triggered the compaction */
  trigger: string;
  /** Custom instructions for the compaction */
  custom_instructions: string;
}

/**
 * Input for SessionStart hook - triggered when a session starts or resumes
 */
export interface SessionStartHookInput extends BaseHookInput {
  hook_event_name: HookEventName.SessionStart;
  /** What triggered the session start: 'startup' | 'resume' | 'clear' | 'compact' */
  source: 'startup' | 'resume' | 'clear' | 'compact';
}

/**
 * Input for SessionEnd hook - triggered when a session ends
 */
export interface SessionEndHookInput extends BaseHookInput {
  hook_event_name: HookEventName.SessionEnd;
  /** The current working directory when the hook is invoked */
  cwd: string;
  /** Why the session ended: 'clear' | 'logout' | 'prompt_input_exit' | 'other' */
  reason: 'clear' | 'logout' | 'prompt_input_exit' | 'other';
}

/**
 * Map of hook event names to their corresponding input types
 */
export interface HookInputMap {
  [HookEventName.PreToolUse]: PreToolUseHookInput;
  [HookEventName.PostToolUse]: PostToolUseHookInput;
  [HookEventName.Notification]: NotificationHookInput;
  [HookEventName.Stop]: StopHookInput;
  [HookEventName.SubagentStop]: SubagentStopHookInput;
  [HookEventName.UserPromptSubmit]: UserPromptSubmitHookInput;
  [HookEventName.PreCompact]: PreCompactHookInput;
  [HookEventName.SessionStart]: SessionStartHookInput;
  [HookEventName.SessionEnd]: SessionEndHookInput;
}

/**
 * Union type of all possible hook inputs
 */
export type HookInput = HookInputMap[keyof HookInputMap];

/**
 * Type guard to check if a hook input matches a specific event type
 */
export function isHookInput<T extends HookEventName>(
  input: HookInput,
  hookEventName: T
): input is HookInputMap[T] {
  return input.hook_event_name === hookEventName;
}

/**
 * Enhanced type checking function that validates both runtime value and provides type narrowing
 */
export function isHookInputOfType<T extends HookEventName>(
  input: unknown,
  eventType: T
): input is HookInputMap[T] {
  return (
    typeof input === 'object' &&
    input !== null &&
    'hook_event_name' in input &&
    (input as Record<string, unknown>).hook_event_name === eventType
  );
}
