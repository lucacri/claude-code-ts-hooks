/**
 * Tests for type guard utilities
 */

import { describe, it, expect } from 'vitest';
import {
  isHookInputOfType,
  isValidHookInputOfType,
  isPreToolUseInput,
  isPostToolUseInput,
  isNotificationInput,
  isStopInput,
  isSubagentStopInput,
  isUserPromptSubmitInput,
  isPreCompactInput,
  isHookEventName,
  validateHookInputType,
  isHookInputLike,
  isHookOutputLike,
} from './type-guards.ts';
import { HookEventName } from '../types/base.ts';
import type { HookInput } from '../types/hook-inputs.ts';

describe('isHookInputOfType', () => {
  const preToolUseInput: HookInput = {
    session_id: 'test-session',
    transcript_path: '/test/path',
    hook_event_name: HookEventName.PreToolUse,
    tool_name: 'test-tool',
    tool_input: { param: 'value' },
    cwd: '/test/cwd',
  };

  const postToolUseInput: HookInput = {
    session_id: 'test-session',
    transcript_path: '/test/path',
    hook_event_name: HookEventName.PostToolUse,
    tool_name: 'test-tool',
    tool_input: { param: 'value' },
    tool_response: { result: 'success' },
    cwd: '/test/cwd',
  };

  it('should return true for matching hook type', () => {
    expect(isHookInputOfType(preToolUseInput, HookEventName.PreToolUse)).toBe(true);
    expect(isHookInputOfType(postToolUseInput, HookEventName.PostToolUse)).toBe(true);
  });

  it('should return false for non-matching hook type', () => {
    expect(isHookInputOfType(preToolUseInput, HookEventName.PostToolUse)).toBe(false);
    expect(isHookInputOfType(postToolUseInput, HookEventName.PreToolUse)).toBe(false);
  });
});

describe('isValidHookInputOfType', () => {
  it('should validate correct PreToolUse input structure', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
      cwd: '/test/cwd',
    };

    expect(isValidHookInputOfType(input, HookEventName.PreToolUse)).toBe(true);
  });

  it('should reject input with wrong hook_event_name', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PostToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    };

    expect(isValidHookInputOfType(input, HookEventName.PreToolUse)).toBe(false);
  });

  it('should reject input missing required fields', () => {
    const input = {
      session_id: 'test-session',
      // missing transcript_path
      hook_event_name: HookEventName.PreToolUse,
    };

    expect(isValidHookInputOfType(input, HookEventName.PreToolUse)).toBe(false);
  });

  it('should reject input with wrong field types', () => {
    const input = {
      session_id: 123, // should be string
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
    };

    expect(isValidHookInputOfType(input, HookEventName.PreToolUse)).toBe(false);
  });

  it('should reject null or undefined input', () => {
    expect(isValidHookInputOfType(null, HookEventName.PreToolUse)).toBe(false);
    expect(isValidHookInputOfType(undefined, HookEventName.PreToolUse)).toBe(false);
  });

  it('should reject non-object input', () => {
    expect(isValidHookInputOfType('string', HookEventName.PreToolUse)).toBe(false);
    expect(isValidHookInputOfType(123, HookEventName.PreToolUse)).toBe(false);
    expect(isValidHookInputOfType([], HookEventName.PreToolUse)).toBe(false);
  });
});

describe('specific type guards', () => {
  const createInput = (hookEventName: HookEventName, extraFields: Record<string, unknown> = {}) => {
    const baseInput = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: hookEventName,
      // Add default required fields for each type
      ...(hookEventName === HookEventName.PreToolUse && { tool_name: 'test', tool_input: {}, cwd: '/test/cwd' }),
      ...(hookEventName === HookEventName.PostToolUse && { tool_name: 'test', tool_input: {}, tool_response: {}, cwd: '/test/cwd' }),
      ...(hookEventName === HookEventName.Notification && { message: 'test', cwd: '/test/cwd' }),
      ...(hookEventName === HookEventName.Stop && { stop_hook_active: true }),
      ...(hookEventName === HookEventName.SubagentStop && { stop_hook_active: false }),
      ...(hookEventName === HookEventName.UserPromptSubmit && { prompt: 'test', cwd: '/test/cwd' }),
      ...(hookEventName === HookEventName.PreCompact && { trigger: 'manual' as const, custom_instructions: 'test' }),
      ...extraFields,
    };
    return baseInput as HookInput; // Use type assertion to avoid complex union type issues
  };

  describe('isPreToolUseInput', () => {
    it('should return true for PreToolUse input', () => {
      const input = createInput(HookEventName.PreToolUse, {
        tool_name: 'test-tool',
        tool_input: { param: 'value' },
      });
      expect(isPreToolUseInput(input)).toBe(true);
    });

    it('should return false for other input types', () => {
      const input = createInput(HookEventName.PostToolUse, {
        tool_name: 'test-tool',
        tool_input: { param: 'value' },
        tool_response: { result: 'success' },
      });
      expect(isPreToolUseInput(input)).toBe(false);
    });
  });

  describe('isPostToolUseInput', () => {
    it('should return true for PostToolUse input', () => {
      const input = createInput(HookEventName.PostToolUse, {
        tool_name: 'test-tool',
        tool_input: { param: 'value' },
        tool_response: { result: 'success' },
      });
      expect(isPostToolUseInput(input)).toBe(true);
    });

    it('should return false for other input types', () => {
      const input = createInput(HookEventName.PreToolUse, {
        tool_name: 'test-tool',
        tool_input: { param: 'value' },
      });
      expect(isPostToolUseInput(input)).toBe(false);
    });
  });

  describe('isNotificationInput', () => {
    it('should return true for Notification input', () => {
      const input = createInput(HookEventName.Notification, {
        message: 'Test notification',
      });
      expect(isNotificationInput(input)).toBe(true);
    });

    it('should return false for other input types', () => {
      const input = createInput(HookEventName.Stop, {
        stop_hook_active: true,
      });
      expect(isNotificationInput(input)).toBe(false);
    });
  });

  describe('isStopInput', () => {
    it('should return true for Stop input', () => {
      const input = createInput(HookEventName.Stop, {
        stop_hook_active: true,
      });
      expect(isStopInput(input)).toBe(true);
    });

    it('should return false for other input types', () => {
      const input = createInput(HookEventName.Notification, {
        message: 'Test notification',
      });
      expect(isStopInput(input)).toBe(false);
    });
  });

  describe('isSubagentStopInput', () => {
    it('should return true for SubagentStop input', () => {
      const input = createInput(HookEventName.SubagentStop, {
        stop_hook_active: false,
      });
      expect(isSubagentStopInput(input)).toBe(true);
    });

    it('should return false for other input types', () => {
      const input = createInput(HookEventName.Stop, {
        stop_hook_active: true,
      });
      expect(isSubagentStopInput(input)).toBe(false);
    });
  });

  describe('isUserPromptSubmitInput', () => {
    it('should return true for UserPromptSubmit input', () => {
      const input = createInput(HookEventName.UserPromptSubmit, {
        prompt: 'Test prompt',
      });
      expect(isUserPromptSubmitInput(input)).toBe(true);
    });

    it('should return false for other input types', () => {
      const input = createInput(HookEventName.PreCompact, {
        trigger: 'manual',
        custom_instructions: 'Test instructions',
      });
      expect(isUserPromptSubmitInput(input)).toBe(false);
    });
  });

  describe('isPreCompactInput', () => {
    it('should return true for PreCompact input', () => {
      const input = createInput(HookEventName.PreCompact, {
        trigger: 'manual',
        custom_instructions: 'Test instructions',
      });
      expect(isPreCompactInput(input)).toBe(true);
    });

    it('should return false for other input types', () => {
      const input = createInput(HookEventName.UserPromptSubmit, {
        prompt: 'Test prompt',
      });
      expect(isPreCompactInput(input)).toBe(false);
    });
  });
});

describe('isHookEventName', () => {
  it('should return true for valid hook event names', () => {
    expect(isHookEventName(HookEventName.PreToolUse)).toBe(true);
    expect(isHookEventName(HookEventName.PostToolUse)).toBe(true);
    expect(isHookEventName(HookEventName.Stop)).toBe(true);
    expect(isHookEventName(HookEventName.UserPromptSubmit)).toBe(true);
    expect(isHookEventName(HookEventName.Notification)).toBe(true);
    expect(isHookEventName(HookEventName.SubagentStop)).toBe(true);
    expect(isHookEventName(HookEventName.PreCompact)).toBe(true);
  });

  it('should return false for invalid hook event names', () => {
    expect(isHookEventName('InvalidEvent')).toBe(false);
    expect(isHookEventName('')).toBe(false);
    expect(isHookEventName(null)).toBe(false);
    expect(isHookEventName(undefined)).toBe(false);
    expect(isHookEventName(123)).toBe(false);
    expect(isHookEventName({})).toBe(false);
  });
});

describe('validateHookInputType', () => {
  it('should validate correct input type', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
      cwd: '/test/cwd',
    };

    const result = validateHookInputType(input, HookEventName.PreToolUse);

    expect(result.isValid).toBe(true);
    if (result.isValid) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject non-object input', () => {
    const result = validateHookInputType('not an object', HookEventName.PreToolUse);

    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toBe('Input must be an object');
    }
  });

  it('should reject null input', () => {
    const result = validateHookInputType(null, HookEventName.PreToolUse);

    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toBe('Input must be an object');
    }
  });

  it('should reject input missing hook_event_name', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
    };

    const result = validateHookInputType(input, HookEventName.PreToolUse);

    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toBe('Missing hook_event_name property');
    }
  });

  it('should reject input with wrong hook_event_name', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PostToolUse,
    };

    const result = validateHookInputType(input, HookEventName.PreToolUse);

    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toBe('Expected hook_event_name to be PreToolUse');
      expect(result.actualType).toBe(HookEventName.PostToolUse);
    }
  });

  it('should reject input missing session_id', () => {
    const input = {
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
    };

    const result = validateHookInputType(input, HookEventName.PreToolUse);

    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toBe('Missing or invalid session_id property');
    }
  });

  it('should reject input with invalid session_id type', () => {
    const input = {
      session_id: 123,
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
    };

    const result = validateHookInputType(input, HookEventName.PreToolUse);

    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toBe('Missing or invalid session_id property');
    }
  });

  it('should reject input missing transcript_path', () => {
    const input = {
      session_id: 'test-session',
      hook_event_name: HookEventName.PreToolUse,
    };

    const result = validateHookInputType(input, HookEventName.PreToolUse);

    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toBe('Missing or invalid transcript_path property');
    }
  });

  it('should reject input with invalid transcript_path type', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: 123,
      hook_event_name: HookEventName.PreToolUse,
    };

    const result = validateHookInputType(input, HookEventName.PreToolUse);

    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toBe('Missing or invalid transcript_path property');
    }
  });
});

describe('isHookInputLike', () => {
  it('should return true for valid hook input structure', () => {
    const input = {
      hook_event_name: HookEventName.PreToolUse,
      session_id: 'test-session',
      other_field: 'value',
    };

    expect(isHookInputLike(input)).toBe(true);
  });

  it('should return false for input missing hook_event_name', () => {
    const input = {
      session_id: 'test-session',
    };

    expect(isHookInputLike(input)).toBe(false);
  });

  it('should return false for input missing session_id', () => {
    const input = {
      hook_event_name: HookEventName.PreToolUse,
    };

    expect(isHookInputLike(input)).toBe(false);
  });

  it('should return false for input with invalid hook_event_name', () => {
    const input = {
      hook_event_name: 'InvalidEvent',
      session_id: 'test-session',
    };

    expect(isHookInputLike(input)).toBe(false);
  });

  it('should return false for input with invalid session_id type', () => {
    const input = {
      hook_event_name: HookEventName.PreToolUse,
      session_id: 123,
    };

    expect(isHookInputLike(input)).toBe(false);
  });

  it('should return false for non-object input', () => {
    expect(isHookInputLike('string')).toBe(false);
    expect(isHookInputLike(123)).toBe(false);
    expect(isHookInputLike(null)).toBe(false);
    expect(isHookInputLike(undefined)).toBe(false);
  });
});

describe('isHookOutputLike', () => {
  it('should return true for valid hook output structure', () => {
    const output = {
      continue: true,
      stopReason: 'Test reason',
      suppressOutput: false,
    };

    expect(isHookOutputLike(output)).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isHookOutputLike({})).toBe(true);
  });

  it('should return true for partial hook output', () => {
    const output = {
      continue: false,
    };

    expect(isHookOutputLike(output)).toBe(true);
  });

  it('should return false for output with invalid continue type', () => {
    const output = {
      continue: 'not-boolean',
    };

    expect(isHookOutputLike(output)).toBe(false);
  });

  it('should return false for output with invalid stopReason type', () => {
    const output = {
      stopReason: 123,
    };

    expect(isHookOutputLike(output)).toBe(false);
  });

  it('should return false for output with invalid suppressOutput type', () => {
    const output = {
      suppressOutput: 'not-boolean',
    };

    expect(isHookOutputLike(output)).toBe(false);
  });

  it('should return false for non-object input', () => {
    expect(isHookOutputLike('string')).toBe(false);
    expect(isHookOutputLike(123)).toBe(false);
    expect(isHookOutputLike(null)).toBe(false);
    expect(isHookOutputLike(undefined)).toBe(false);
  });

  it('should return true for object with additional valid fields', () => {
    const output = {
      continue: true,
      decision: 'approve',
      customField: 'value',
    };

    expect(isHookOutputLike(output)).toBe(true);
  });
});
