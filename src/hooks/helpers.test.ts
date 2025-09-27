import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createHookHandler,
  createHookRegistry,
  executeHook,
  withLogging,
  withTimeout,
  createHookConfig,
  createHookOutput,
} from './helpers.ts';
import { HookEventName } from '../types/base.ts';
import type { HookHandler } from '../types/hook-handler.ts';

describe('createHookHandler', () => {
  it('should create handler for PreToolUse', () => {
    const handler = createHookHandler(HookEventName.PreToolUse, async (_payload) => {
      return { decision: 'approve' as const };
    });

    expect(handler.eventName).toBe(HookEventName.PreToolUse);
    expect(typeof handler.handler).toBe('function');
  });

  it('should create handler for PostToolUse', () => {
    const handler = createHookHandler(HookEventName.PostToolUse, async (_payload) => {
      return { decision: 'block' as const };
    });

    expect(handler.eventName).toBe(HookEventName.PostToolUse);
  });

  it('should create handler for Stop', () => {
    const handler = createHookHandler(HookEventName.Stop, async (_payload) => {
      return {};
    });

    expect(handler.eventName).toBe(HookEventName.Stop);
  });

  it('should create handler for Notification', () => {
    const handler = createHookHandler(HookEventName.Notification, async (_payload) => {
      return {};
    });

    expect(handler.eventName).toBe(HookEventName.Notification);
  });

  it('should create handler for SubagentStop', () => {
    const handler = createHookHandler(HookEventName.SubagentStop, async (_payload) => {
      return {};
    });

    expect(handler.eventName).toBe(HookEventName.SubagentStop);
  });

  it('should create handler for PreCompact', () => {
    const handler = createHookHandler(HookEventName.PreCompact, async (_payload) => {
      return {};
    });

    expect(handler.eventName).toBe(HookEventName.PreCompact);
  });
});

describe('createHookRegistry', () => {
  it('should create registry from handlers', () => {
    const preToolUseHandler = createHookHandler(HookEventName.PreToolUse, async () => ({ decision: 'approve' as const }));
    const stopHandler = createHookHandler(HookEventName.Stop, async () => ({}));
    
    const handlersForRegistry = [
      { eventName: preToolUseHandler.eventName, handler: preToolUseHandler.handler as HookHandler },
      { eventName: stopHandler.eventName, handler: stopHandler.handler as HookHandler }
    ];
    const registry = createHookRegistry(handlersForRegistry);

    expect(registry[HookEventName.PreToolUse]).toBeDefined();
    expect(registry[HookEventName.Stop]).toBeDefined();
    expect(typeof registry[HookEventName.PreToolUse]).toBe('function');
  });

  it('should create empty registry from empty array', () => {
    const registry = createHookRegistry([]);
    expect(Object.keys(registry)).toHaveLength(0);
  });
});

describe('executeHook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute hook successfully', async () => {
    const handler = vi.fn().mockResolvedValue({ decision: 'approve' });
    const input = {
      session_id: 'test',
      transcript_path: '/test',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: {},
    };

    vi.setSystemTime(new Date('2024-01-01T10:00:00.000Z'));

    const result = await executeHook(handler, input);

    expect(result.success).toBe(true);
    expect(result.output).toEqual({ decision: 'approve' });
    expect(result.duration).toBe(0);
    expect(result.context.startTime).toEqual(new Date('2024-01-01T10:00:00.000Z'));
  });

  it('should handle hook execution failure', async () => {
    const error = new Error('Test error');
    const handler = vi.fn().mockRejectedValue(error);
    const input = {
      session_id: 'test',
      transcript_path: '/test',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: {},
    };

    const result = await executeHook(handler, input);

    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
    expect(result.output).toEqual({});
  });

  it('should handle execution context', async () => {
    const handler = vi.fn().mockResolvedValue({});
    const input = {
      session_id: 'test',
      transcript_path: '/test',
      hook_event_name: HookEventName.Stop,
      stop_hook_active: true,
    };
    const context = {
      config: { timeout: 5000 },
      metadata: { key: 'value' },
    };

    const result = await executeHook(handler, input, context);

    expect(result.success).toBe(true);
    expect(result.context.config).toEqual({ timeout: 5000 });
    expect(result.context.metadata).toEqual({ key: 'value' });
  });
});

describe('withLogging', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn> & { mockRestore: () => void };

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {}) as ReturnType<typeof vi.spyOn> & { mockRestore: () => void };
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T10:00:00.000Z'));
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    vi.useRealTimers();
  });

  it('should log hook execution', async () => {
    const handler = vi.fn().mockResolvedValue({ decision: 'approve' });
    const loggedHandler = withLogging(handler);
    const input = {
      session_id: 'test',
      transcript_path: '/test',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: {},
    };

    await loggedHandler(input);

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Hook] Executing hook: PreToolUse',
      JSON.stringify({
        sessionId: 'test',
        timestamp: '2024-01-01T10:00:00.000Z',
      }, null, 2)
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Hook] Hook completed successfully: PreToolUse',
      ''
    );
  });

  it('should log hook execution failure', async () => {
    const error = new Error('Test error');
    const handler = vi.fn().mockRejectedValue(error);
    const loggedHandler = withLogging(handler);
    const input = {
      session_id: 'test',
      transcript_path: '/test',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: {},
    };

    await expect(loggedHandler(input)).rejects.toThrow('Test error');

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Hook] Executing hook: PreToolUse',
      JSON.stringify({
        sessionId: 'test',
        timestamp: '2024-01-01T10:00:00.000Z',
      }, null, 2)
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Hook] Hook failed: PreToolUse',
      JSON.stringify({
        error: 'Test error',
      }, null, 2)
    );
  });

  it('should use custom logger', async () => {
    const customLogger = vi.fn();
    const handler = vi.fn().mockResolvedValue({});
    const loggedHandler = withLogging(handler, customLogger);
    const input = {
      session_id: 'test',
      transcript_path: '/test',
      hook_event_name: HookEventName.Stop,
      stop_hook_active: true,
    };

    await loggedHandler(input);

    expect(customLogger).toHaveBeenCalledWith(
      'Executing hook: Stop',
      {
        sessionId: 'test',
        timestamp: '2024-01-01T10:00:00.000Z',
      }
    );
    expect(customLogger).toHaveBeenCalledWith(
      'Hook completed successfully: Stop'
    );
  });
});

describe('withTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute handler within timeout', async () => {
    const handler = vi.fn().mockResolvedValue({ decision: 'approve' });
    const timedHandler = withTimeout(handler, 1000);
    const input = {
      session_id: 'test',
      transcript_path: '/test',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: {},
    };

    const resultPromise = timedHandler(input);
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    expect(result).toEqual({ decision: 'approve' });
  });

  it('should timeout if handler takes too long', async () => {
    const handler = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
    const timedHandler = withTimeout(handler, 1000);
    const input = {
      session_id: 'test',
      transcript_path: '/test',
      hook_event_name: HookEventName.PreToolUse,
      tool_name: 'test-tool',
      tool_input: {},
    };

    const resultPromise = timedHandler(input);
    vi.advanceTimersByTime(1000);

    await expect(resultPromise).rejects.toThrow('Hook timeout after 1000ms: PreToolUse');
  });
});

describe('createHookConfig', () => {
  it('should create config with all fields', () => {
    const config = createHookConfig({
      event: HookEventName.PreToolUse,
      command: 'test-command',
      timeout: 5000,
      description: 'Test description',
      matcher: { tool: 'test-tool' },
    });

    expect(config).toEqual({
      event: HookEventName.PreToolUse,
      command: 'test-command',
      timeout: 5000,
      description: 'Test description',
      matcher: { tool: 'test-tool' },
    });
  });

  it('should create config with only required fields', () => {
    const config = createHookConfig({
      event: HookEventName.Stop,
      command: 'stop-command',
    });

    expect(config).toEqual({
      event: HookEventName.Stop,
      command: 'stop-command',
    });
  });
});

describe('createHookOutput', () => {
  it('should create success output', () => {
    const output = createHookOutput.success({ decision: 'approve' });
    expect(output).toEqual({
      continue: true,
      decision: 'approve',
    });
  });

  it('should create success output without additional fields', () => {
    const output = createHookOutput.success();
    expect(output).toEqual({
      continue: true,
    });
  });

  it('should create block output', () => {
    const output = createHookOutput.block('Test reason', { decision: 'block' });
    expect(output).toEqual({
      continue: false,
      stopReason: 'Test reason',
      decision: 'block',
    });
  });

  it('should create approve output', () => {
    const output = createHookOutput.approve('Test reason');
    expect(output).toEqual({
      continue: true,
      decision: 'approve',
      reason: 'Test reason',
    });
  });

  it('should create approve output without reason', () => {
    const output = createHookOutput.approve();
    expect(output).toEqual({
      continue: true,
      decision: 'approve',
    });
  });

  it('should create deny output', () => {
    const output = createHookOutput.deny('Not allowed');
    expect(output).toEqual({
      continue: false,
      decision: 'block',
      reason: 'Not allowed',
      stopReason: 'Not allowed',
    });
  });
});
