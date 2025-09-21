/**
 * Base types for Claude Code hooks
 */

/**
 * Base hook input that all hook events extend from
 */
export interface BaseHookInput {
  /** Unique session identifier for the Claude Code session */
  session_id: string;
  /** Path to the transcript file for this session */
  transcript_path: string;
  /** Name of the hook event being triggered */
  hook_event_name: string;
}

/**
 * Base hook output that all hook responses extend from
 */
export interface BaseHookOutput {
  /** Whether to continue execution after the hook */
  continue?: boolean;
  /** Reason for stopping if continue is false */
  stopReason?: string;
  /** Whether to suppress output from the hook */
  suppressOutput?: boolean;
}

/**
 * Generic tool input parameters
 */
export type ToolInput = Record<string, unknown>;

/**
 * Generic tool response data
 */
export type ToolResponse = Record<string, unknown>;

/**
 * Hook decision types for controlling execution flow
 */
export type HookDecision = 'approve' | 'block';

/**
 * Hook event names supported by Claude Code
 */
export enum HookEventName {
  PreToolUse = 'PreToolUse',
  PostToolUse = 'PostToolUse',
  Notification = 'Notification',
  Stop = 'Stop',
  SubagentStop = 'SubagentStop',
  UserPromptSubmit = 'UserPromptSubmit',
  PreCompact = 'PreCompact',
}

/**
 * Hook event name type for backward compatibility
 */
export type HookEventNameType = `${HookEventName}`;

/**
 * Configuration for hook execution
 */
export interface HookConfig {
  /** The event that triggers this hook */
  event: HookEventName;
  /** Shell command to execute */
  command: string;
  /** Optional timeout in milliseconds */
  timeout?: number;
  /** Human-readable description of what the hook does */
  description?: string;
  /** Optional matcher conditions for when to run the hook */
  matcher?: {
    /** Tool name to match (for tool-related hooks) */
    tool?: string;
    /** Other matching criteria */
    [key: string]: unknown;
  };
}