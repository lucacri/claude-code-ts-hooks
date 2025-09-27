/**
 * Validation utilities for hook inputs and outputs
 */

import { z } from 'zod';
import { HookInputSchema, HookEventNameSchema } from '../schemas/hook-input-schemas.ts';
import { HookOutputSchema } from '../schemas/hook-output-schemas.ts';
import type { HookInput, HookInputMap } from '../types/hook-inputs.ts';
import type { HookOutput } from '../types/hook-outputs.ts';
import type { HookEventName } from '../types/base.ts';

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: z.ZodError;
}

/**
 * Validates a hook input against the schema
 */
export function validateHookInput(input: unknown): ValidationResult<HookInput> {
  try {
    const data = HookInputSchema.parse(input);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

/**
 * Validates a hook output against the schema
 */
export function validateHookOutput(output: unknown): ValidationResult<HookOutput> {
  try {
    const data = HookOutputSchema.parse(output);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

/**
 * Validates a hook event name
 */
export function validateHookEventName(eventName: unknown): ValidationResult<HookEventName> {
  try {
    const data = HookEventNameSchema.parse(eventName);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

/**
 * Type-safe hook input parser with specific event type
 */
export function parseHookInput<T extends HookEventName>(
  input: unknown,
  expectedEventName: T
): ValidationResult<HookInputMap[T]> {
  const result = validateHookInput(input);
  
  if (!result.success || !result.data) {
    return result as ValidationResult<HookInputMap[T]>;
  }

  if (result.data.hook_event_name !== expectedEventName) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          message: `Expected hook event '${expectedEventName}', got '${result.data.hook_event_name}'`,
          path: ['hook_event_name'],
        },
      ]),
    };
  }

  return {
    success: true,
    data: result.data as HookInputMap[T],
  };
}

/**
 * Safely parse JSON input for hooks
 */
export function safeParseJSON(jsonString: string): ValidationResult<unknown> {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          message: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
          path: [],
        },
      ]),
    };
  }
}
