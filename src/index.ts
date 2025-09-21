/**
 * Claude Code TypeScript Hooks
 * 
 * Provides comprehensive TypeScript types and utilities for Claude Code hooks,
 * enabling type-safe hook implementations with runtime validation.
 * 
 * @example Basic usage:
 * ```typescript
 * import { 
 *   PreToolUseHookInput, 
 *   PreToolUseHookOutput, 
 *   createHookHandler, 
 *   validateHookInput 
 * } from 'claude-code-ts-hooks';
 * 
 * // Create a type-safe hook handler
 * const preToolUseHandler = createHookHandler('PreToolUse', async (input) => {
 *   console.log(`About to use tool: ${input.tool_name}`);
 *   return { continue: true, decision: 'approve' };
 * });
 * 
 * // Validate hook input at runtime
 * const result = validateHookInput(someUnknownInput);
 * if (result.success) {
 *   console.log('Valid hook input:', result.data);
 * }
 * ```
 */

// Export all types
export * from './types/index.js';

// Export all schemas
export * from './schemas/index.js';

// Export all utilities
export * from './utils/index.js';

// Export hook helpers
export * from './hooks/index.js';

// Export the enum for direct usage
export { HookEventName } from './types/base.js';

// Re-export commonly used types for convenience
export type {
  // Base types
  BaseHookInput,
  BaseHookOutput,
  HookEventNameType,
  HookConfig,
  ToolInput,
  ToolResponse,

  // Input types
  HookInput,
  HookInputMap,
  PreToolUseHookInput,
  PostToolUseHookInput,
  NotificationHookInput,
  StopHookInput,
  SubagentStopHookInput,
  UserPromptSubmitHookInput,
  PreCompactHookInput,

  // Output types
  HookOutput,
  HookOutputMap,
  PreToolUseHookOutput,
  PostToolUseHookOutput,
  NotificationHookOutput,
  StopHookOutput,
  SubagentStopHookOutput,
  UserPromptSubmitHookOutput,
  PreCompactHookOutput,

  // Handler types
  HookHandler,
  HookHandlerFor,
  HookRegistry,
  HookExecutionResult,
  HookExecutionContext,

  // SDK types
  PermissionResult,
  CanUseTool,
  PermissionMode,
  ClaudeCodeOptions,
} from './types/index.js';

// Re-export commonly used functions
export {
  // Validation
  validateHookInput,
  validateHookOutput,
  validateHookEventName,
  parseHookInput,
  safeParseJSON,

  // Type guards
  isHookInputOfType,
  isPreToolUseInput,
  isPostToolUseInput,
  isNotificationInput,
  isStopInput,
  isSubagentStopInput,
  isUserPromptSubmitInput,
  isPreCompactInput,
  isHookEventName,
  isHookInputLike,
  isHookOutputLike,

  // Hook helpers
  createHookHandler,
  createHookRegistry,
  executeHook,
  withLogging,
  withTimeout,
  createHookConfig,
  createHookOutput,
} from './utils/index.js';

// Package version and metadata
export const VERSION = '1.0.0';
export const PACKAGE_NAME = 'claude-code-ts-hooks';