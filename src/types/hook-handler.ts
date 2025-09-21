/**
 * Hook handler type definitions
 */

import { HookInput, HookInputMap } from './hook-inputs.js';
import { HookOutput, HookOutputMap } from './hook-outputs.js';

/**
 * Generic hook handler function type
 */
export type HookHandler<
  TInput extends HookInput = HookInput,
  TOutput extends HookOutput = HookOutput
> = (input: TInput) => Promise<TOutput> | TOutput;

/**
 * Specific hook handler for a given event type
 */
export type HookHandlerFor<T extends keyof HookInputMap> = HookHandler<
  HookInputMap[T],
  HookOutputMap[T]
>;

/**
 * Map of hook event names to their handler functions
 */
export interface HookHandlerMap {
  PreToolUse: HookHandlerFor<'PreToolUse'>;
  PostToolUse: HookHandlerFor<'PostToolUse'>;
  Notification: HookHandlerFor<'Notification'>;
  Stop: HookHandlerFor<'Stop'>;
  SubagentStop: HookHandlerFor<'SubagentStop'>;
  UserPromptSubmit: HookHandlerFor<'UserPromptSubmit'>;
  PreCompact: HookHandlerFor<'PreCompact'>;
}

/**
 * Hook registry that maps event names to handlers
 */
export type HookRegistry = Partial<HookHandlerMap>;

/**
 * Hook middleware function that can modify input/output
 */
export type HookMiddleware = <T extends HookInput, U extends HookOutput>(
  input: T,
  next: HookHandler<T, U>
) => Promise<U> | U;

/**
 * Hook execution context
 */
export interface HookExecutionContext {
  /** Start time of hook execution */
  startTime: Date;
  /** Hook configuration */
  config?: {
    timeout?: number;
    [key: string]: unknown;
  };
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Hook execution result
 */
export interface HookExecutionResult<T extends HookOutput = HookOutput> {
  /** The hook output */
  output: T;
  /** Execution duration in milliseconds */
  duration: number;
  /** Whether execution was successful */
  success: boolean;
  /** Error information if execution failed */
  error?: Error;
  /** Execution context */
  context: HookExecutionContext;
}