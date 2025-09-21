/**
 * Type guard utilities for runtime type checking
 */

import type { HookInput, HookInputMap } from '../types/hook-inputs.js';
import type { HookOutput } from '../types/hook-outputs.js';
import type { HookEventName } from '../types/base.js';

/**
 * Type guard to check if a hook input matches a specific event type
 */
export function isHookInputOfType<T extends keyof HookInputMap>(
  input: HookInput,
  eventName: T
): input is HookInputMap[T] {
  return input.hook_event_name === eventName;
}

/**
 * Type guard for PreToolUse hook input
 */
export function isPreToolUseInput(input: HookInput): input is HookInputMap['PreToolUse'] {
  return isHookInputOfType(input, 'PreToolUse');
}

/**
 * Type guard for PostToolUse hook input
 */
export function isPostToolUseInput(input: HookInput): input is HookInputMap['PostToolUse'] {
  return isHookInputOfType(input, 'PostToolUse');
}

/**
 * Type guard for Notification hook input
 */
export function isNotificationInput(input: HookInput): input is HookInputMap['Notification'] {
  return isHookInputOfType(input, 'Notification');
}

/**
 * Type guard for Stop hook input
 */
export function isStopInput(input: HookInput): input is HookInputMap['Stop'] {
  return isHookInputOfType(input, 'Stop');
}

/**
 * Type guard for SubagentStop hook input
 */
export function isSubagentStopInput(input: HookInput): input is HookInputMap['SubagentStop'] {
  return isHookInputOfType(input, 'SubagentStop');
}

/**
 * Type guard for UserPromptSubmit hook input
 */
export function isUserPromptSubmitInput(input: HookInput): input is HookInputMap['UserPromptSubmit'] {
  return isHookInputOfType(input, 'UserPromptSubmit');
}

/**
 * Type guard for PreCompact hook input
 */
export function isPreCompactInput(input: HookInput): input is HookInputMap['PreCompact'] {
  return isHookInputOfType(input, 'PreCompact');
}

/**
 * Type guard to check if a value is a valid hook event name
 */
export function isHookEventName(value: unknown): value is HookEventName {
  return typeof value === 'string' && [
    'PreToolUse',
    'PostToolUse',
    'Notification',
    'Stop',
    'SubagentStop',
    'UserPromptSubmit',
    'PreCompact',
  ].includes(value);
}

/**
 * Type guard to check if an object has the basic structure of a hook input
 */
export function isHookInputLike(value: unknown): value is Pick<HookInput, 'hook_event_name' | 'session_id'> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'hook_event_name' in value &&
    'session_id' in value &&
    typeof (value as any).hook_event_name === 'string' &&
    typeof (value as any).session_id === 'string'
  );
}

/**
 * Type guard to check if an object has the basic structure of a hook output
 */
export function isHookOutputLike(value: unknown): value is Partial<HookOutput> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as any;
  return (
    (obj.continue === undefined || typeof obj.continue === 'boolean') &&
    (obj.stopReason === undefined || typeof obj.stopReason === 'string') &&
    (obj.suppressOutput === undefined || typeof obj.suppressOutput === 'boolean')
  );
}