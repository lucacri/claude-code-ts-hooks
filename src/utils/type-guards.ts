/**
 * Type guard utilities for runtime type checking
 */

import type { HookInput, HookInputMap } from '../types/hook-inputs.js';
import type { HookOutput } from '../types/hook-outputs.js';
import { HookEventName } from '../types/base.js';

/**
 * Type guard to check if a hook input matches a specific event type
 */
export function isHookInputOfType<T extends HookEventName>(
  input: HookInput,
  eventName: T
): input is HookInputMap[T] {
  return input.hook_event_name === eventName;
}

/**
 * Enhanced type guard that also validates unknown input
 */
export function isValidHookInputOfType<T extends HookEventName>(
  input: unknown,
  eventName: T
): input is HookInputMap[T] {
  return (
    typeof input === 'object' &&
    input !== null &&
    'hook_event_name' in input &&
    (input as any).hook_event_name === eventName &&
    'session_id' in input &&
    typeof (input as any).session_id === 'string' &&
    'transcript_path' in input &&
    typeof (input as any).transcript_path === 'string'
  );
}

/**
 * Type guard for PreToolUse hook input
 */
export function isPreToolUseInput(input: HookInput): input is HookInputMap[HookEventName.PreToolUse] {
  return isHookInputOfType(input, HookEventName.PreToolUse);
}

/**
 * Type guard for PostToolUse hook input
 */
export function isPostToolUseInput(input: HookInput): input is HookInputMap[HookEventName.PostToolUse] {
  return isHookInputOfType(input, HookEventName.PostToolUse);
}

/**
 * Type guard for Notification hook input
 */
export function isNotificationInput(input: HookInput): input is HookInputMap[HookEventName.Notification] {
  return isHookInputOfType(input, HookEventName.Notification);
}

/**
 * Type guard for Stop hook input
 */
export function isStopInput(input: HookInput): input is HookInputMap[HookEventName.Stop] {
  return isHookInputOfType(input, HookEventName.Stop);
}

/**
 * Type guard for SubagentStop hook input
 */
export function isSubagentStopInput(input: HookInput): input is HookInputMap[HookEventName.SubagentStop] {
  return isHookInputOfType(input, HookEventName.SubagentStop);
}

/**
 * Type guard for UserPromptSubmit hook input
 */
export function isUserPromptSubmitInput(input: HookInput): input is HookInputMap[HookEventName.UserPromptSubmit] {
  return isHookInputOfType(input, HookEventName.UserPromptSubmit);
}

/**
 * Type guard for PreCompact hook input
 */
export function isPreCompactInput(input: HookInput): input is HookInputMap[HookEventName.PreCompact] {
  return isHookInputOfType(input, HookEventName.PreCompact);
}

/**
 * Type guard to check if a value is a valid hook event name
 */
export function isHookEventName(value: unknown): value is HookEventName {
  return Object.values(HookEventName).includes(value as HookEventName);
}

/**
 * Enhanced type checking function with better error messages
 * Returns an object with validation result and specific error information
 */
export function validateHookInputType<T extends HookEventName>(
  input: unknown,
  expectedType: T
): { 
  isValid: true; 
  data: HookInputMap[T]; 
} | { 
  isValid: false; 
  error: string; 
  actualType?: string; 
} {
  if (!input || typeof input !== 'object') {
    return { isValid: false, error: 'Input must be an object' };
  }

  const obj = input as any;

  if (!('hook_event_name' in obj)) {
    return { isValid: false, error: 'Missing hook_event_name property' };
  }

  if (obj.hook_event_name !== expectedType) {
    return { 
      isValid: false, 
      error: `Expected hook_event_name to be ${expectedType}`, 
      actualType: obj.hook_event_name 
    };
  }

  if (!('session_id' in obj) || typeof obj.session_id !== 'string') {
    return { isValid: false, error: 'Missing or invalid session_id property' };
  }

  if (!('transcript_path' in obj) || typeof obj.transcript_path !== 'string') {
    return { isValid: false, error: 'Missing or invalid transcript_path property' };
  }

  return { isValid: true, data: obj as HookInputMap[T] };
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
    isHookEventName((value as any).hook_event_name) &&
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