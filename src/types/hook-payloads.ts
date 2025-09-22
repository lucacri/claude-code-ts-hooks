/**
 * Hook payload type definitions following the simple approach
 */

// Base hook payload
export interface BaseHookPayload {
  session_id: string
  transcript_path: string
  hook_type: string
}

export interface PreToolUsePayload extends BaseHookPayload {
  hook_type: 'PreToolUse'
  tool_name: string
  tool_input: Record<string, unknown>
}

export interface PostToolUsePayload extends BaseHookPayload {
  hook_type: 'PostToolUse'
  tool_name: string
  tool_input: Record<string, unknown>
  tool_response: Record<string, unknown>
}

export interface NotificationPayload extends BaseHookPayload {
  hook_type: 'Notification'
  message: string
}

export interface StopPayload extends BaseHookPayload {
  hook_type: 'Stop'
  stop_hook_active: boolean
}

export interface SubagentStopPayload extends BaseHookPayload {
  hook_type: 'SubagentStop'
  stop_hook_active: boolean
}

export interface UserPromptSubmitPayload extends BaseHookPayload {
  hook_type: 'UserPromptSubmit'
  prompt: string
}

export interface PreCompactPayload extends BaseHookPayload {
  hook_type: 'PreCompact'
  trigger: string
  custom_instructions: string
}

export interface SessionStartPayload extends BaseHookPayload {
  hook_type: 'SessionStart'
}

export type HookPayload =
  | PreToolUsePayload
  | PostToolUsePayload
  | NotificationPayload
  | StopPayload
  | SubagentStopPayload
  | UserPromptSubmitPayload
  | PreCompactPayload
  | SessionStartPayload