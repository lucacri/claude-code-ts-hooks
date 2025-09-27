/**
 * Tests for hook input schemas
 */

import { describe, it, expect } from 'vitest';
import {
  BaseHookInputSchema,
  PreToolUseHookInputSchema,
  PostToolUseHookInputSchema,
  NotificationHookInputSchema,
  StopHookInputSchema,
  SubagentStopHookInputSchema,
  UserPromptSubmitHookInputSchema,
  PreCompactHookInputSchema,
  HookInputSchema,
  HookEventNameSchema,
} from './hook-input-schemas.ts';
import { HookEventName } from '../types/base.ts';

describe('BaseHookInputSchema', () => {
  it('should validate valid base hook input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: 'TestEvent',
    };

    const result = BaseHookInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should reject input missing session_id', () => {
    const input = {
      transcript_path: '/test/path',
      hook_event_name: 'TestEvent',
    };

    const result = BaseHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should reject input with invalid types', () => {
    const input = {
      session_id: 123,
      transcript_path: '/test/path',
      hook_event_name: 'TestEvent',
    };

    const result = BaseHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('PreToolUseHookInputSchema', () => {
  it('should validate valid PreToolUse input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    };

    const result = PreToolUseHookInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject input with wrong hook_event_name', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PostToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    };

    const result = PreToolUseHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should reject input missing tool_name', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
      tool_input: { param: 'value' },
    };

    const result = PreToolUseHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should reject input missing tool_input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
    };

    const result = PreToolUseHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('PostToolUseHookInputSchema', () => {
  it('should validate valid PostToolUse input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PostToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
      tool_response: { result: 'success' },
    };

    const result = PostToolUseHookInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject input missing tool_response', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PostToolUse,
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    };

    const result = PostToolUseHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('NotificationHookInputSchema', () => {
  it('should validate valid Notification input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.Notification,
      message: 'Test notification',
    };

    const result = NotificationHookInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject input missing message', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.Notification,
    };

    const result = NotificationHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('StopHookInputSchema', () => {
  it('should validate valid Stop input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.Stop,
      stop_hook_active: true,
    };

    const result = StopHookInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject input missing stop_hook_active', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.Stop,
    };

    const result = StopHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should reject input with invalid stop_hook_active type', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.Stop,
      stop_hook_active: 'not-boolean',
    };

    const result = StopHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('SubagentStopHookInputSchema', () => {
  it('should validate valid SubagentStop input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.SubagentStop,
      stop_hook_active: false,
    };

    const result = SubagentStopHookInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });
});

describe('UserPromptSubmitHookInputSchema', () => {
  it('should validate valid UserPromptSubmit input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.UserPromptSubmit,
      prompt: 'Test prompt',
    };

    const result = UserPromptSubmitHookInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject input missing prompt', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.UserPromptSubmit,
    };

    const result = UserPromptSubmitHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('PreCompactHookInputSchema', () => {
  it('should validate valid PreCompact input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreCompact,
      trigger: 'manual',
      custom_instructions: 'Test instructions',
    };

    const result = PreCompactHookInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it('should reject input missing trigger', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreCompact,
      custom_instructions: 'Test instructions',
    };

    const result = PreCompactHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should reject input missing custom_instructions', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: HookEventName.PreCompact,
      trigger: 'manual',
    };

    const result = PreCompactHookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('HookInputSchema', () => {
  it('should validate all hook input types', () => {
    const inputs = [
      {
        session_id: 'test-session',
        transcript_path: '/test/path',
        hook_event_name: HookEventName.PreToolUse,
        tool_name: 'test-tool',
        tool_input: { param: 'value' },
      },
      {
        session_id: 'test-session',
        transcript_path: '/test/path',
        hook_event_name: HookEventName.PostToolUse,
        tool_name: 'test-tool',
        tool_input: { param: 'value' },
        tool_response: { result: 'success' },
      },
      {
        session_id: 'test-session',
        transcript_path: '/test/path',
        hook_event_name: HookEventName.Notification,
        message: 'Test notification',
      },
      {
        session_id: 'test-session',
        transcript_path: '/test/path',
        hook_event_name: HookEventName.Stop,
        stop_hook_active: true,
      },
      {
        session_id: 'test-session',
        transcript_path: '/test/path',
        hook_event_name: HookEventName.SubagentStop,
        stop_hook_active: false,
      },
      {
        session_id: 'test-session',
        transcript_path: '/test/path',
        hook_event_name: HookEventName.UserPromptSubmit,
        prompt: 'Test prompt',
      },
      {
        session_id: 'test-session',
        transcript_path: '/test/path',
        hook_event_name: HookEventName.PreCompact,
        trigger: 'manual',
        custom_instructions: 'Test instructions',
      },
    ];

    inputs.forEach((input) => {
      const result = HookInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid hook input', () => {
    const input = {
      session_id: 'test-session',
      transcript_path: '/test/path',
      hook_event_name: 'InvalidEvent',
    };

    const result = HookInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('HookEventNameSchema', () => {
  it('should validate all hook event names', () => {
    const validNames = [
      HookEventName.PreToolUse,
      HookEventName.PostToolUse,
      HookEventName.Notification,
      HookEventName.Stop,
      HookEventName.SubagentStop,
      HookEventName.UserPromptSubmit,
      HookEventName.PreCompact,
    ];

    validNames.forEach((name) => {
      const result = HookEventNameSchema.safeParse(name);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(name);
      }
    });
  });

  it('should reject invalid hook event names', () => {
    const invalidNames = ['InvalidEvent', '', null, undefined, 123];

    invalidNames.forEach((name) => {
      const result = HookEventNameSchema.safeParse(name);
      expect(result.success).toBe(false);
    });
  });
});
