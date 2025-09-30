/**
 * Hook response type definitions following the simple approach
 */

// Base hook response
export interface BaseHookResponse {
  continue?: boolean
  stopReason?: string
  suppressOutput?: boolean
  systemMessage?: string
}

// PreToolUse specific response
// @deprecated Use hookSpecificOutput.permissionDecision instead of decision
export interface PreToolUseResponse extends BaseHookResponse {
  /** @deprecated Use hookSpecificOutput.permissionDecision instead */
  decision?: 'approve' | 'block'
  /** @deprecated Use hookSpecificOutput.permissionDecisionReason instead */
  reason?: string
  hookSpecificOutput?: {
    hookEventName: 'PreToolUse'
    permissionDecision?: 'allow' | 'deny' | 'ask'
    permissionDecisionReason?: string
  }
}

// PostToolUse specific response
export interface PostToolUseResponse extends BaseHookResponse {
  decision?: 'block'
  reason?: string
  hookSpecificOutput?: {
    hookEventName: 'PostToolUse'
    additionalContext?: string
  }
}

// Stop/SubagentStop specific response
export interface StopResponse extends BaseHookResponse {
  decision?: 'block'
  reason?: string // Required when decision is 'block'
}

// UserPromptSubmit specific response
export interface UserPromptSubmitResponse extends BaseHookResponse {
  decision?: 'block'
  reason?: string
  hookSpecificOutput?: {
    hookEventName: 'UserPromptSubmit'
    additionalContext?: string
  }
}

// PreCompact specific response
export interface PreCompactResponse extends BaseHookResponse {
  // PreCompact hooks cannot block execution
}

// SessionStart specific response
export interface SessionStartResponse extends BaseHookResponse {
  hookSpecificOutput?: {
    hookEventName: 'SessionStart'
    additionalContext?: string
  }
}

// SessionEnd specific response
export interface SessionEndResponse extends BaseHookResponse {
  // SessionEnd hooks cannot block execution
}

// Legacy simple response for backward compatibility
export interface HookResponse {
  action: 'continue' | 'block'
  stopReason?: string
}
