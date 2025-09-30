/**
 * Hook output type definitions for all Claude Code hook events
 */

import type { BaseHookOutput, HookDecision, HookEventName } from './base.ts';

/**
 * Output for PreToolUse hook - can approve or block tool execution
 * @deprecated Use hookSpecificOutput.permissionDecision instead of decision
 */
export interface PreToolUseHookOutput extends BaseHookOutput {
  /** @deprecated Use hookSpecificOutput.permissionDecision instead. Decision on whether to allow the tool to execute */
  decision?: HookDecision;
  /** @deprecated Use hookSpecificOutput.permissionDecisionReason instead. Reason for the decision */
  reason?: string;
  /** Hook-specific output data */
  hookSpecificOutput?: {
    /** Name of the hook event */
    hookEventName: 'PreToolUse';
    /** Permission decision: 'allow' bypasses permission system, 'deny' blocks execution, 'ask' prompts user */
    permissionDecision?: 'allow' | 'deny' | 'ask';
    /** Reason for the permission decision */
    permissionDecisionReason?: string;
  };
}

/**
 * Output for PostToolUse hook - can block further execution
 */
export interface PostToolUseHookOutput extends BaseHookOutput {
  /** Decision on whether to block further execution */
  decision?: 'block';
  /** Reason for blocking */
  reason?: string;
  /** Hook-specific output data */
  hookSpecificOutput?: {
    /** Name of the hook event */
    hookEventName: 'PostToolUse';
    /** Additional context information for Claude to consider */
    additionalContext?: string;
  };
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
  /** Decision on whether to block the prompt submission (only 'block' or undefined) */
  decision?: 'block';
  /** Reason for blocking (shown to user but not added to context) */
  reason?: string;
  /** Hook-specific output data */
  hookSpecificOutput?: {
    /** Name of the hook event */
    hookEventName: 'UserPromptSubmit';
    /** Additional context to inject into the conversation */
    additionalContext?: string;
  };
}

/**
 * Output for PreCompact hook - typically no decision needed
 * Note: Exit code 2 shows stderr to user only, does not block
 */
export interface PreCompactHookOutput extends BaseHookOutput {
  // PreCompact hooks cannot block execution
}

/**
 * Output for SessionStart hook - can inject context at session start
 */
export interface SessionStartHookOutput extends BaseHookOutput {
  /** Hook-specific output data */
  hookSpecificOutput?: {
    /** Name of the hook event */
    hookEventName: 'SessionStart';
    /** Additional context to inject at session start */
    additionalContext?: string;
  };
}

/**
 * Output for SessionEnd hook - cannot block session termination
 * Note: SessionEnd hooks run when a session ends but cannot prevent termination
 */
export interface SessionEndHookOutput extends BaseHookOutput {
  // SessionEnd hooks cannot block execution
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
  [HookEventName.SessionStart]: SessionStartHookOutput;
  [HookEventName.SessionEnd]: SessionEndHookOutput;
}

/**
 * Union type of all possible hook outputs
 */
export type HookOutput = HookOutputMap[keyof HookOutputMap];

/**
 * Helper type to get the output type for a specific hook event
 */
export type HookOutputFor<T extends keyof HookOutputMap> = HookOutputMap[T];
