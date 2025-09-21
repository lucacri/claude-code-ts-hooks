/**
 * Tests for hook output schemas
 */

import { describe, it, expect } from 'vitest';
import {
  BaseHookOutputSchema,
  HookDecisionSchema,
  PreToolUseHookOutputSchema,
  PostToolUseHookOutputSchema,
  StopHookOutputSchema,
  NotificationHookOutputSchema,
  SubagentStopHookOutputSchema,
  UserPromptSubmitHookOutputSchema,
  PreCompactHookOutputSchema,
  HookOutputSchema,
} from './hook-output-schemas.js';

describe('BaseHookOutputSchema', () => {
  it('should validate valid base hook output', () => {
    const output = {
      continue: true,
      stopReason: 'Test reason',
      suppressOutput: false,
    };

    const result = BaseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });

  it('should validate empty output', () => {
    const output = {};

    const result = BaseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });

  it('should validate partial output', () => {
    const output = {
      continue: false,
    };

    const result = BaseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });

  it('should reject output with invalid types', () => {
    const output = {
      continue: 'not-boolean',
    };

    const result = BaseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(false);
  });
});

describe('HookDecisionSchema', () => {
  it('should validate approve decision', () => {
    const result = HookDecisionSchema.safeParse('approve');
    expect(result.success).toBe(true);
  });

  it('should validate block decision', () => {
    const result = HookDecisionSchema.safeParse('block');
    expect(result.success).toBe(true);
  });

  it('should reject invalid decision', () => {
    const result = HookDecisionSchema.safeParse('invalid');
    expect(result.success).toBe(false);
  });
});

describe('PreToolUseHookOutputSchema', () => {
  it('should validate valid PreToolUse output with approve decision', () => {
    const output = {
      continue: true,
      decision: 'approve' as const,
      reason: 'Tool usage approved',
    };

    const result = PreToolUseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate valid PreToolUse output with block decision', () => {
    const output = {
      continue: false,
      decision: 'block' as const,
      reason: 'Tool usage blocked',
    };

    const result = PreToolUseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate PreToolUse output without decision', () => {
    const output = {
      continue: true,
    };

    const result = PreToolUseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });

  it('should reject PreToolUse output with invalid decision', () => {
    const output = {
      decision: 'invalid',
    };

    const result = PreToolUseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(false);
  });
});

describe('PostToolUseHookOutputSchema', () => {
  it('should validate valid PostToolUse output with block decision', () => {
    const output = {
      continue: false,
      decision: 'block' as const,
      reason: 'Further execution blocked',
    };

    const result = PostToolUseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate PostToolUse output without decision', () => {
    const output = {
      continue: true,
    };

    const result = PostToolUseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });

  it('should reject PostToolUse output with approve decision', () => {
    const output = {
      decision: 'approve',
    };

    const result = PostToolUseHookOutputSchema.safeParse(output);
    expect(result.success).toBe(false);
  });
});

describe('StopHookOutputSchema', () => {
  it('should validate valid Stop output with block decision', () => {
    const output = {
      continue: false,
      decision: 'block' as const,
      reason: 'Stop blocked',
    };

    const result = StopHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate Stop output without decision', () => {
    const output = {};

    const result = StopHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });
});

describe('NotificationHookOutputSchema', () => {
  it('should validate valid Notification output', () => {
    const output = {
      continue: true,
      suppressOutput: false,
    };

    const result = NotificationHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate empty Notification output', () => {
    const output = {};

    const result = NotificationHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });

  it('should reject Notification output with decision', () => {
    const output = {
      decision: 'approve',
    };

    const result = NotificationHookOutputSchema.safeParse(output);
    expect(result.success).toBe(false);
  });
});

describe('SubagentStopHookOutputSchema', () => {
  it('should validate valid SubagentStop output with block decision', () => {
    const output = {
      continue: false,
      decision: 'block' as const,
      reason: 'Subagent stop blocked',
    };

    const result = SubagentStopHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate SubagentStop output without decision', () => {
    const output = {};

    const result = SubagentStopHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });
});

describe('UserPromptSubmitHookOutputSchema', () => {
  it('should validate valid UserPromptSubmit output with approve decision', () => {
    const output = {
      continue: true,
      decision: 'approve' as const,
      reason: 'Prompt approved',
      contextFiles: ['file1.txt', 'file2.txt'],
      updatedPrompt: 'Updated prompt text',
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: 'Additional context',
      },
    };

    const result = UserPromptSubmitHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate valid UserPromptSubmit output with block decision', () => {
    const output = {
      continue: false,
      decision: 'block' as const,
      reason: 'Prompt blocked',
    };

    const result = UserPromptSubmitHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate UserPromptSubmit output without decision', () => {
    const output = {
      continue: true,
    };

    const result = UserPromptSubmitHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });

  it('should reject UserPromptSubmit output with invalid decision', () => {
    const output = {
      decision: 'invalid',
    };

    const result = UserPromptSubmitHookOutputSchema.safeParse(output);
    expect(result.success).toBe(false);
  });
});

describe('PreCompactHookOutputSchema', () => {
  it('should validate valid PreCompact output with approve decision', () => {
    const output = {
      continue: true,
      decision: 'approve' as const,
      reason: 'Compaction approved',
    };

    const result = PreCompactHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate valid PreCompact output with block decision', () => {
    const output = {
      continue: false,
      decision: 'block' as const,
      reason: 'Compaction blocked',
    };

    const result = PreCompactHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(output);
    }
  });

  it('should validate PreCompact output without decision', () => {
    const output = {};

    const result = PreCompactHookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });
});

describe('HookOutputSchema', () => {
  it('should validate all hook output types', () => {
    const outputs = [
      { continue: true, decision: 'approve' as const, reason: 'PreToolUse approved' },
      { continue: false, decision: 'block' as const, reason: 'PostToolUse blocked' },
      { continue: true, suppressOutput: false },
      { continue: false, decision: 'block' as const, reason: 'Stop blocked' },
      { continue: false, decision: 'block' as const, reason: 'SubagentStop blocked' },
      {
        continue: true,
        decision: 'approve' as const,
        contextFiles: ['file.txt'],
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: 'context',
        },
      },
      { continue: true, decision: 'approve' as const, reason: 'PreCompact approved' },
    ];

    outputs.forEach((output) => {
      const result = HookOutputSchema.safeParse(output);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid hook output', () => {
    const output = {
      continue: 'not-boolean',
    };

    const result = HookOutputSchema.safeParse(output);
    expect(result.success).toBe(false);
  });

  it('should validate empty hook output', () => {
    const output = {};

    const result = HookOutputSchema.safeParse(output);
    expect(result.success).toBe(true);
  });
});