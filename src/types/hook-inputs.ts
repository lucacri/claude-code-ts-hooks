/**
 * Hook input type definitions for all Claude Code hook events
 */

import { BaseHookInput, ToolInput, ToolResponse } from './base.js';

/**
 * Input for PreToolUse hook - triggered before a tool is executed
 */
export interface PreToolUseHookInput extends BaseHookInput {
  hook_event_name: 'PreToolUse';
  /** Name of the tool about to be used */
  tool_name: string;
  /** Input parameters that will be passed to the tool */
  tool_input: ToolInput;
}

/**
 * Input for PostToolUse hook - triggered after a tool has been executed
 */
export interface PostToolUseHookInput extends BaseHookInput {
  hook_event_name: 'PostToolUse';
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
  hook_event_name: 'Notification';
  /** The notification message */
  message: string;
}

/**
 * Input for Stop hook - triggered when Claude finishes responding
 */
export interface StopHookInput extends BaseHookInput {
  hook_event_name: 'Stop';
  /** Whether the stop hook is currently active */
  stop_hook_active: boolean;
}

/**
 * Input for SubagentStop hook - triggered when a subagent stops
 */
export interface SubagentStopHookInput extends BaseHookInput {
  hook_event_name: 'SubagentStop';
  /** Whether the stop hook is currently active */
  stop_hook_active: boolean;
}

/**
 * Input for UserPromptSubmit hook - triggered when user submits a prompt
 */
export interface UserPromptSubmitHookInput extends BaseHookInput {
  hook_event_name: 'UserPromptSubmit';
  /** The user's prompt text */
  prompt: string;
}

/**
 * Input for PreCompact hook - triggered before conversation compaction
 */
export interface PreCompactHookInput extends BaseHookInput {
  hook_event_name: 'PreCompact';
  /** What triggered the compaction */
  trigger: string;
  /** Custom instructions for the compaction */
  custom_instructions: string;
}

/**
 * Map of hook event names to their corresponding input types
 */
export interface HookInputMap {
  PreToolUse: PreToolUseHookInput;
  PostToolUse: PostToolUseHookInput;
  Notification: NotificationHookInput;
  Stop: StopHookInput;
  SubagentStop: SubagentStopHookInput;
  UserPromptSubmit: UserPromptSubmitHookInput;
  PreCompact: PreCompactHookInput;
}

/**
 * Union type of all possible hook inputs
 */
export type HookInput = HookInputMap[keyof HookInputMap];

/**
 * Type guard to check if a hook input matches a specific event type
 */
export function isHookInput<T extends keyof HookInputMap>(
  input: HookInput,
  hookEventName: T
): input is HookInputMap[T] {
  return input.hook_event_name === hookEventName;
}