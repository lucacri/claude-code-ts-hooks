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
  cwd: string
  tool_name: string
  tool_input: Record<string, unknown>
}

export interface PostToolUsePayload extends BaseHookPayload {
  hook_type: 'PostToolUse'
  cwd: string
  tool_name: string
  tool_input: Record<string, unknown>
  tool_response: Record<string, unknown>
}

export interface NotificationPayload extends BaseHookPayload {
  hook_type: 'Notification'
  cwd: string
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
  cwd: string
  prompt: string
}

export interface PreCompactPayload extends BaseHookPayload {
  hook_type: 'PreCompact'
  trigger: string
  custom_instructions: string
}

export interface SessionStartPayload extends BaseHookPayload {
  hook_type: 'SessionStart'
  source: 'startup' | 'resume' | 'clear' | 'compact'
}

export interface SessionEndPayload extends BaseHookPayload {
  hook_type: 'SessionEnd'
  cwd: string
  reason: 'clear' | 'logout' | 'prompt_input_exit' | 'other'
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
  | SessionEndPayload
