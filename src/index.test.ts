/**
 * Tests for main index exports
 */

import { describe, it, expect } from 'vitest';
import * as exports from './index.js';

describe('index exports', () => {
  it('should export runHook function', () => {
    expect(typeof exports.runHook).toBe('function');
  });

  it('should export log function', () => {
    expect(typeof exports.log).toBe('function');
  });

  it('should export version information', () => {
    expect(typeof exports.VERSION).toBe('string');
    expect(typeof exports.PACKAGE_NAME).toBe('string');
    expect(exports.PACKAGE_NAME).toBe('claude-code-ts-hooks');
  });

  it('should export validation functions', () => {
    expect(typeof exports.validateHookInput).toBe('function');
    expect(typeof exports.validateHookOutput).toBe('function');
    expect(typeof exports.validateHookEventName).toBe('function');
    expect(typeof exports.parseHookInput).toBe('function');
    expect(typeof exports.safeParseJSON).toBe('function');
  });

  it('should export type guards', () => {
    expect(typeof exports.isHookInputOfType).toBe('function');
    expect(typeof exports.isValidHookInputOfType).toBe('function');
    expect(typeof exports.isPreToolUseInput).toBe('function');
    expect(typeof exports.isPostToolUseInput).toBe('function');
    expect(typeof exports.isNotificationInput).toBe('function');
    expect(typeof exports.isStopInput).toBe('function');
    expect(typeof exports.isSubagentStopInput).toBe('function');
    expect(typeof exports.isUserPromptSubmitInput).toBe('function');
    expect(typeof exports.isPreCompactInput).toBe('function');
    expect(typeof exports.isHookEventName).toBe('function');
    expect(typeof exports.validateHookInputType).toBe('function');
    expect(typeof exports.isHookInputLike).toBe('function');
    expect(typeof exports.isHookOutputLike).toBe('function');
  });

  it('should export schemas', () => {
    expect(typeof exports.BaseHookInputSchema).toBe('object');
    expect(typeof exports.PreToolUseHookInputSchema).toBe('object');
    expect(typeof exports.PostToolUseHookInputSchema).toBe('object');
    expect(typeof exports.HookInputSchema).toBe('object');
    expect(typeof exports.HookEventNameSchema).toBe('object');
    expect(typeof exports.BaseHookOutputSchema).toBe('object');
    expect(typeof exports.HookOutputSchema).toBe('object');
  });

  it('should have expected number of exports', () => {
    // This helps ensure we don't accidentally break exports
    const exportKeys = Object.keys(exports);
    expect(exportKeys.length).toBeGreaterThan(30); // We have many exports
  });
});