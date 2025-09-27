/**
 * Hook output type definitions for all Claude Code hook events
 */

import type { BaseHookOutput, HookDecision, HookEventName } from './base.ts';

/**
 * Output for PreToolUse hook - can approve or block tool execution
 */
export interface PreToolUseHookOutput extends BaseHookOutput {
  /** Decision on whether to allow the tool to execute */
  decision?: HookDecision;
  /** Reason for the decision (especially important if blocking) */
  reason?: string;
}

/**
 * Output for PostToolUse hook - can block further execution
 */
export interface PostToolUseHookOutput extends BaseHookOutput {
  /** Decision on whether to block further execution */
  decision?: 'block';
  /** Reason for blocking */
  reason?: string;
}

/**
 * Output for Stop hook - can block the stop event
 */
export interface StopHookOutput extends BaseHookOutput {
  /** Decision on whether to block the stop */
  decision?: 'block';
  /** Reason for blocking the stop */
  reason?: string;
}

/**
 * Output for Notification hook - typically no decision needed
 */
export interface NotificationHookOutput extends BaseHookOutput {
  /** Notifications typically don't make decisions */
  decision?: undefined;
}

/**
 * Output for SubagentStop hook - can block the subagent stop
 */
export interface SubagentStopHookOutput extends BaseHookOutput {
  /** Decision on whether to block the subagent stop */
  decision?: 'block';
  /** Reason for blocking */
  reason?: string;
}

/**
 * Output for UserPromptSubmit hook - can block prompt submission
 */
export interface UserPromptSubmitHookOutput extends BaseHookOutput {
  /** Decision on whether to block the prompt submission */
  decision?: 'block';
  /** Reason for blocking */
  reason?: string;
  /** Hook-specific output data */
  hookSpecificOutput?: {
    /** Name of the hook event */
    hookEventName: string;
    /** Additional context information */
    additionalContext: string;
  };
}

/**
 * Output for PreCompact hook - typically no decision needed
 */
export interface PreCompactHookOutput extends BaseHookOutput {
  /** Pre-compact hooks typically don't make decisions */
  decision?: undefined;
}

/**
 * Map of hook event names to their corresponding output types
 */
export interface HookOutputMap {
  [HookEventName.PreToolUse]: PreToolUseHookOutput;
  [HookEventName.PostToolUse]: PostToolUseHookOutput;
  [HookEventName.Notification]: NotificationHookOutput;
  [HookEventName.Stop]: StopHookOutput;
  [HookEventName.SubagentStop]: SubagentStopHookOutput;
  [HookEventName.UserPromptSubmit]: UserPromptSubmitHookOutput;
  [HookEventName.PreCompact]: PreCompactHookOutput;
}

/**
 * Union type of all possible hook outputs
 */
export type HookOutput = HookOutputMap[keyof HookOutputMap];

/**
 * Helper type to get the output type for a specific hook event
 */
export type HookOutputFor<T extends keyof HookOutputMap> = HookOutputMap[T];
