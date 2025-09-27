/**
 * Hook response type definitions following the simple approach
 */

// Base hook response
export interface BaseHookResponse {
  continue?: boolean
  stopReason?: string
  suppressOutput?: boolean
}

// PreToolUse specific response
export interface PreToolUseResponse extends BaseHookResponse {
  decision?: 'approve' | 'block'
  reason?: string
}

// PostToolUse specific response
export interface PostToolUseResponse extends BaseHookResponse {
  decision?: 'block'
  reason?: string
}

// Stop/SubagentStop specific response
export interface StopResponse extends BaseHookResponse {
  decision?: 'block'
  reason?: string // Required when decision is 'block'
}

// UserPromptSubmit specific response
export interface UserPromptSubmitResponse extends BaseHookResponse {
  decision?: 'approve' | 'block'
  reason?: string
  contextFiles?: string[]
  updatedPrompt?: string
  hookSpecificOutput?: {
    hookEventName: 'UserPromptSubmit'
    additionalContext?: string
  }
}

// PreCompact specific response
export interface PreCompactResponse extends BaseHookResponse {
  decision?: 'approve' | 'block'
  reason?: string
}

// SessionStart specific response
export interface SessionStartResponse extends BaseHookResponse {
  decision?: 'approve' | 'block'
  reason?: string
  hookSpecificOutput?: {
    hookEventName: 'SessionStart'
    additionalContext?: string
  }
}

// Legacy simple response for backward compatibility
export interface HookResponse {
  action: 'continue' | 'block'
  stopReason?: string
}
