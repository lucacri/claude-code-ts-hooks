/**
 * Tests for validation utilities
 */

import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import {
  validateHookInput,
  validateHookOutput,
  validateHookEventName,
  parseHookInput,
  safeParseJSON,
} from './validation.ts';
import { HookEventName } from '../types/base.ts';
import { HookInputSchema, HookEventNameSchema } from '../schemas/hook-input-schemas.ts';
import { HookOutputSchema } from '../schemas/hook-output-schemas.ts';

describe('validateHookInput', () => {
  it('should validate valid PreToolUse input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    };

    const result = validateHookInput(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should validate valid PostToolUse input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PostToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
      tool_response: { result: 'success' },
    };

    const result = validateHookInput(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should validate valid Stop input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.Stop,
      stop_hook_active: true,
    };

    const result = validateHookInput(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should validate valid UserPromptSubmit input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.UserPromptSubmit,
      prompt: 'Test prompt',
    };

    const result = validateHookInput(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject invalid input missing required fields', () => {
    const input = {
      session_id: 'test-session',
      // missing transcript_path and hook_event_name
    };

    const result = validateHookInput(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });

  it('should reject input with invalid hook_event_name', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: 'InvalidEvent',
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    };

    const result = validateHookInput(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });

  it('should reject input with wrong type for required field', () => {
    const input = {
      session_id: 123, // should be string
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    };

    const result = validateHookInput(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });
});

describe('validateHookOutput', () => {
  it('should validate valid hook output', () => {
    const output = {
      continue: true,
      decision: 'approve',
      reason: 'Test reason',
    };

    const result = validateHookOutput(output);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate empty hook output', () => {
    const output = {};

    const result = validateHookOutput(output);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should reject invalid hook output', () => {
    const output = {
      continue: 'not-boolean', // should be boolean
    };

    const result = validateHookOutput(output);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });
});

describe('validateHookEventName', () => {
  it('should validate valid hook event names', () => {
    const validNames = [
      HookEventName.PreToolUse,
      HookEventName.PostToolUse,
      HookEventName.Stop,
      HookEventName.UserPromptSubmit,
      HookEventName.Notification,
      HookEventName.SubagentStop,
      HookEventName.PreCompact,
    ];

    validNames.forEach((name) => {
      const result = validateHookEventName(name);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(name);
      }
    });
  });

  it('should reject invalid hook event name', () => {
    const result = validateHookEventName('InvalidEvent');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });

  it('should reject non-string input', () => {
    const result = validateHookEventName(123);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });
});

describe('parseHookInput', () => {
  it('should parse valid input with matching event name', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    };

    const result = parseHookInput(input, HookEventName.PreToolUse);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject input with mismatched event name', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PostToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
      tool_response: { result: 'success' }, // Add required field
    };

    const result = parseHookInput(input, HookEventName.PreToolUse);

    expect(result.success).toBe(false);
    if (!result.success && result.error) {
      expect(result.error).toBeInstanceOf(z.ZodError);
      expect(result.error.issues[0]?.message).toContain('Expected hook event');
    }
  });

  it('should reject invalid input structure', () => {
    const input = {
      session_id: 'test-session',
      // missing required fields
    };

    const result = parseHookInput(input, HookEventName.PreToolUse);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });
});

describe('safeParseJSON', () => {
  it('should parse valid JSON string', () => {
    const jsonString = '{"key": "value", "number": 123}';

    const result = safeParseJSON(jsonString);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ key: 'value', number: 123 });
    }
  });

  it('should handle empty JSON object', () => {
    const jsonString = '{}';

    const result = safeParseJSON(jsonString);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it('should handle JSON array', () => {
    const jsonString = '[1, 2, 3]';

    const result = safeParseJSON(jsonString);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual([1, 2, 3]);
    }
  });

  it('should reject invalid JSON string', () => {
    const jsonString = '{"key": value}'; // missing quotes around value

    const result = safeParseJSON(jsonString);

    expect(result.success).toBe(false);
    if (!result.success && result.error) {
      expect(result.error).toBeInstanceOf(z.ZodError);
      expect(result.error.issues[0]?.message).toContain('Invalid JSON');
    }
  });

  it('should reject completely malformed JSON', () => {
    const jsonString = 'not json at all';

    const result = safeParseJSON(jsonString);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });

  it('should handle null and undefined values in JSON', () => {
    const jsonString = '{"nullValue": null, "undefinedValue": null}';

    const result = safeParseJSON(jsonString);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ nullValue: null, undefinedValue: null });
    }
  });

  it('should handle non-Error objects in error catch blocks', () => {
    // Test to cover the error handling branches
    const invalidInput = null;

    const result = validateHookInput(invalidInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });

  it('should handle validation errors from z.ZodError', () => {
    // Test to cover different error paths
    const input = {
      session_id: 123, // wrong type
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
    };

    const result = validateHookInput(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });

  // Test non-ZodError handling for complete coverage
  it('should rethrow non-ZodError for validateHookInput', () => {
    // Mock HookInputSchema.parse to throw a non-ZodError
    const originalParse = HookInputSchema.parse;
    vi.spyOn(HookInputSchema, 'parse').mockImplementation(() => {
      throw new Error('Non-Zod error');
    });

    expect(() => validateHookInput({})).toThrow('Non-Zod error');

    // Restore original parse
    HookInputSchema.parse = originalParse;
  });

  it('should rethrow non-ZodError for validateHookOutput', () => {
    // Mock HookOutputSchema.parse to throw a non-ZodError
    const originalParse = HookOutputSchema.parse;
    vi.spyOn(HookOutputSchema, 'parse').mockImplementation(() => {
      throw new Error('Non-Zod error');
    });

    expect(() => validateHookOutput({})).toThrow('Non-Zod error');

    // Restore original parse
    HookOutputSchema.parse = originalParse;
  });

  it('should rethrow non-ZodError for validateHookEventName', () => {
    // Mock HookEventNameSchema.parse to throw a non-ZodError
    const originalParse = HookEventNameSchema.parse;
    vi.spyOn(HookEventNameSchema, 'parse').mockImplementation(() => {
      throw new Error('Non-Zod error');
    });

    expect(() => validateHookEventName('test')).toThrow('Non-Zod error');

    // Restore original parse
    HookEventNameSchema.parse = originalParse;
  });
});
