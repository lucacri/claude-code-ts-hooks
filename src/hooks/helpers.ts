/**
 * Helper functions for working with hooks
 */

import type {
  HookHandler,
  HookHandlerFor,
  HookRegistry,
  HookExecutionResult,
  HookExecutionContext,
} from '../types/hook-handler.js';
import type { HookInput } from '../types/hook-inputs.js';
import type { HookOutput } from '../types/hook-outputs.js';
import type { HookEventName, HookConfig } from '../types/base.js';

/**
 * Creates a type-safe hook handler for a specific event type
 * Overloaded for each hook event type to provide precise type inference
 */
export function createHookHandler<T extends HookEventName>(
  eventName: T,
  handler: HookHandlerFor<T>
): { eventName: T; handler: HookHandlerFor<T> };

export function createHookHandler(
  eventName: HookEventName.PreToolUse,
  handler: HookHandlerFor<HookEventName.PreToolUse>
): { eventName: HookEventName.PreToolUse; handler: HookHandlerFor<HookEventName.PreToolUse> };

export function createHookHandler(
  eventName: HookEventName.PostToolUse,
  handler: HookHandlerFor<HookEventName.PostToolUse>
): { eventName: HookEventName.PostToolUse; handler: HookHandlerFor<HookEventName.PostToolUse> };

export function createHookHandler(
  eventName: HookEventName.Stop,
  handler: HookHandlerFor<HookEventName.Stop>
): { eventName: HookEventName.Stop; handler: HookHandlerFor<HookEventName.Stop> };

export function createHookHandler(
  eventName: HookEventName.UserPromptSubmit,
  handler: HookHandlerFor<HookEventName.UserPromptSubmit>
): { eventName: HookEventName.UserPromptSubmit; handler: HookHandlerFor<HookEventName.UserPromptSubmit> };

export function createHookHandler(
  eventName: HookEventName.Notification,
  handler: HookHandlerFor<HookEventName.Notification>
): { eventName: HookEventName.Notification; handler: HookHandlerFor<HookEventName.Notification> };

export function createHookHandler(
  eventName: HookEventName.SubagentStop,
  handler: HookHandlerFor<HookEventName.SubagentStop>
): { eventName: HookEventName.SubagentStop; handler: HookHandlerFor<HookEventName.SubagentStop> };

export function createHookHandler(
  eventName: HookEventName.PreCompact,
  handler: HookHandlerFor<HookEventName.PreCompact>
): { eventName: HookEventName.PreCompact; handler: HookHandlerFor<HookEventName.PreCompact> };

// Implementation
export function createHookHandler<T extends HookEventName>(
  eventName: T,
  handler: HookHandlerFor<T>
): { eventName: T; handler: HookHandlerFor<T> } {
  return { eventName, handler };
}

/**
 * Creates a hook registry from an array of handlers
 */
export function createHookRegistry(
  handlers: Array<{
    eventName: HookEventName;
    handler: HookHandler;
  }>
): HookRegistry {
  const registry: HookRegistry = {};
  
  for (const { eventName, handler } of handlers) {
    // Type assertion needed due to strict intersection types in HookRegistry
    (registry as Record<string, unknown>)[eventName] = handler;
  }
  
  return registry;
}

/**
 * Executes a hook handler with timing and error handling
 */
export async function executeHook<T extends HookInput, U extends HookOutput>(
  handler: HookHandler<T, U>,
  input: T,
  context?: Partial<HookExecutionContext>
): Promise<HookExecutionResult<U>> {
  const startTime = new Date();
  const executionContext: HookExecutionContext = {
    startTime,
    config: context?.config || undefined,
    metadata: context?.metadata || undefined,
  };

  try {
    const output = await handler(input);
    const duration = Date.now() - startTime.getTime();

    return {
      output,
      duration,
      success: true,
      context: executionContext,
    };
  } catch (error) {
    const duration = Date.now() - startTime.getTime();

    return {
      output: {} as U, // Default empty output on error
      duration,
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
      context: executionContext,
    };
  }
}

/**
 * Creates a hook handler that logs execution details
 */
export function withLogging<T extends HookInput, U extends HookOutput>(
  handler: HookHandler<T, U>,
  logger?: (message: string, data?: unknown) => void
): HookHandler<T, U> {
  const log = logger || ((message: string, data?: unknown) => {
    console.log(`[Hook] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  });

  return async (input: T): Promise<U> => {
    log(`Executing hook: ${input.hook_event_name}`, {
      sessionId: input.session_id,
      timestamp: new Date().toISOString(),
    });

    try {
      const result = await handler(input);
      log(`Hook completed successfully: ${input.hook_event_name}`);
      return result;
    } catch (error) {
      log(`Hook failed: ${input.hook_event_name}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  };
}

/**
 * Creates a hook handler with timeout support
 */
export function withTimeout<T extends HookInput, U extends HookOutput>(
  handler: HookHandler<T, U>,
  timeoutMs: number
): HookHandler<T, U> {
  return async (input: T): Promise<U> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Hook timeout after ${timeoutMs}ms: ${input.hook_event_name}`));
      }, timeoutMs);
    });

    return Promise.race([handler(input), timeoutPromise]);
  };
}

/**
 * Creates a hook configuration object
 */
/**
 * Creates a hook configuration object
 */
export function createHookConfig(config: {
  event: HookEventName;
  command: string;
  timeout?: number;
  description?: string;
  matcher?: HookConfig['matcher'];
}): HookConfig {
  const result: HookConfig = {
    event: config.event,
    command: config.command,
  };
  
  if (config.timeout !== undefined) {
    result.timeout = config.timeout;
  }
  
  if (config.description !== undefined) {
    result.description = config.description;
  }
  
  if (config.matcher !== undefined) {
    result.matcher = config.matcher;
  }
  
  return result;
}

/**
 * Default hook output factory functions
 */
export const createHookOutput = {
  /**
   * Creates a successful hook output
   */
  success: <T extends HookOutput>(additionalFields?: Partial<T>): T => ({
    continue: true,
    ...additionalFields,
  } as T),

  /**
   * Creates a blocking hook output
   */
  block: <T extends HookOutput>(reason: string, additionalFields?: Partial<T>): T => ({
    continue: false,
    stopReason: reason,
    ...additionalFields,
  } as T),

  /**
   * Creates an approving PreToolUse hook output
   */
  approve: (reason?: string) => ({
    continue: true,
    decision: 'approve' as const,
    reason,
  }),

  /**
   * Creates a denying PreToolUse hook output
   */
  deny: (reason: string) => ({
    continue: false,
    decision: 'block' as const,
    reason,
    stopReason: reason,
  }),
};