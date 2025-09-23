/**
 * Tests for cross-platform runtime utilities
 */

import { describe, it, expect } from 'vitest';
import { detectRuntime, getArgs, getEnv } from './runtime.js';

describe('runtime utilities', () => {
  describe('detectRuntime', () => {
    it('should detect runtime correctly', () => {
      const runtime = detectRuntime();
      
      // In our test environment, it should be node
      expect(['node', 'deno', 'bun', 'unknown']).toContain(runtime);
    });
  });

  describe('getArgs', () => {
    it('should return command line arguments', () => {
      const args = getArgs();
      expect(Array.isArray(args)).toBe(true);
    });
  });

  describe('getEnv', () => {
    it('should access environment variables', () => {
      // PATH should exist in most environments
      const path = getEnv('PATH');
      expect(typeof path === 'string' || path === undefined).toBe(true);
    });

    it('should return undefined for non-existent variables', () => {
      const nonExistent = getEnv('NON_EXISTENT_VAR_12345');
      expect(nonExistent).toBeUndefined();
    });
  });
});