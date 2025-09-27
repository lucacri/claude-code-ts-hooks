/**
 * Tests for cross-platform runtime utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectRuntime, getArgs, getEnv, readStdin, exit } from './runtime.ts';
import { Buffer } from "node:buffer";

describe('runtime utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('detectRuntime', () => {
    it('should detect runtime correctly', () => {
      const runtime = detectRuntime();
      
      // In our test environment, it should be node
      expect(['node', 'deno', 'bun', 'unknown']).toContain(runtime);
    });

    it('should detect deno runtime', () => {
      // Mock globalThis for Deno runtime detection
      vi.stubGlobal('Deno', { args: [] });
      
      const runtime = detectRuntime();
      expect(runtime).toBe('deno');
      
      // Clean up
      vi.unstubAllGlobals();
    });

    it('should detect bun runtime', () => {
      // Mock globalThis for Bun runtime detection
      vi.stubGlobal('Buno', undefined);
      vi.stubGlobal('Bun', {});
      
      const runtime = detectRuntime();
      expect(runtime).toBe('bun');
      
      // Clean up
      vi.unstubAllGlobals();
    });

    it('should detect node runtime', () => {
      // Ensure Deno and Bun are not present, then mock Node.js process
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      vi.stubGlobal('process', {
        versions: { node: '18.0.0' }
      });
      
      const runtime = detectRuntime();
      expect(runtime).toBe('node');
      
      // Clean up
      vi.unstubAllGlobals();
    });

    it('should return unknown for unrecognized runtime', () => {
      // Remove all runtime indicators
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      vi.stubGlobal('process', undefined);
      
      const runtime = detectRuntime();
      expect(runtime).toBe('unknown');
      
      // Clean up
      vi.unstubAllGlobals();
    });
  });

  describe('getArgs', () => {
    it('should return command line arguments', () => {
      const args = getArgs();
      expect(Array.isArray(args)).toBe(true);
    });

    it('should return Deno args when in Deno runtime', () => {
      vi.stubGlobal('Deno', { args: ['--allow-read', 'script.ts'] });
      
      const args = getArgs();
      expect(args).toEqual(['--allow-read', 'script.ts']);
      
      vi.unstubAllGlobals();
    });

    it('should return process argv when in node/bun runtime', () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('process', {
        argv: ['node', 'script.js', 'arg1', 'arg2'],
        versions: { node: '18.0.0' }
      });
      
      const args = getArgs();
      expect(args).toEqual(['arg1', 'arg2']);
      
      vi.unstubAllGlobals();
    });

    it('should return empty array for unknown runtime', () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      vi.stubGlobal('process', undefined);
      
      const args = getArgs();
      expect(args).toEqual([]);
      
      vi.unstubAllGlobals();
    });

    it('should handle missing Deno args', () => {
      vi.stubGlobal('Deno', {}); // Deno without args
      
      const args = getArgs();
      expect(args).toEqual([]);
      
      vi.unstubAllGlobals();
    });

    it('should handle missing process argv', () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('process', { versions: { node: '18.0.0' } }); // process without argv
      
      const args = getArgs();
      expect(args).toEqual([]);
      
      vi.unstubAllGlobals();
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

    it('should get environment variables from Deno', () => {
      const mockGet = vi.fn().mockReturnValue('deno-test-value');
      vi.stubGlobal('Deno', {
        env: { get: mockGet }
      });
      
      const result = getEnv('TEST_VAR');
      expect(result).toBe('deno-test-value');
      expect(mockGet).toHaveBeenCalledWith('TEST_VAR');
      
      vi.unstubAllGlobals();
    });

    it('should get environment variables from process in node/bun', () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('process', {
        env: { TEST_VAR: 'node-test-value' },
        versions: { node: '18.0.0' }
      });
      
      const result = getEnv('TEST_VAR');
      expect(result).toBe('node-test-value');
      
      vi.unstubAllGlobals();
    });

    it('should return undefined for unknown runtime', () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      vi.stubGlobal('process', undefined);
      
      const result = getEnv('TEST_VAR');
      expect(result).toBeUndefined();
      
      vi.unstubAllGlobals();
    });
  });

  describe('readStdin', () => {
    it('should throw error for unsupported runtime', async () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      vi.stubGlobal('process', undefined);
      
      await expect(readStdin()).rejects.toThrow('Unsupported runtime for stdin reading');
      
      vi.unstubAllGlobals();
    });

    it('should throw error when Deno stdin not available', async () => {
      vi.stubGlobal('Deno', {}); // Deno without stdin
      
      await expect(readStdin()).rejects.toThrow('Deno stdin not available');
      
      vi.unstubAllGlobals();
    });

    it('should throw error when process not available in node/bun', async () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', {}); // Bun runtime but no process  
      vi.stubGlobal('process', undefined); // No process available
      
      await expect(readStdin()).rejects.toThrow('Process not available');
      
      vi.unstubAllGlobals();
    });

    it('should handle Deno stdin reading', async () => {
      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({ done: false, value: new Uint8Array([72, 101, 108, 108, 111]) }) // "Hello"
          .mockResolvedValueOnce({ done: true, value: undefined }),
        releaseLock: vi.fn()
      };

      vi.stubGlobal('Deno', {
        stdin: {
          readable: {
            getReader: vi.fn().mockReturnValue(mockReader)
          }
        }
      });
      
      const result = await readStdin();
      expect(result).toBe('Hello');
      expect(mockReader.releaseLock).toHaveBeenCalled();
      
      vi.unstubAllGlobals();
    });

    it('should handle Node.js/Bun stdin reading', async () => {
      vi.stubGlobal('Deno', undefined);
      
      const mockProcess = {
        stdin: {
          setEncoding: vi.fn(),
          on: vi.fn()
        },
        versions: { node: '18.0.0' }
      };

      vi.stubGlobal('process', mockProcess);
      
      // Mock the stdin events
      const readStdinPromise = readStdin();
      
      // Simulate data event
      const dataCallback = mockProcess.stdin.on.mock.calls.find(call => call[0] === 'data')?.[1];
      const endCallback = mockProcess.stdin.on.mock.calls.find(call => call[0] === 'end')?.[1];
      
      if (dataCallback && endCallback) {
        dataCallback(Buffer.from('test data'));
        endCallback();
      }
      
      const result = await readStdinPromise;
      expect(result).toBe('test data');
      expect(mockProcess.stdin.setEncoding).toHaveBeenCalledWith('utf8');
      
      vi.unstubAllGlobals();
    });

    it('should handle Node.js/Bun stdin error', async () => {
      vi.stubGlobal('Deno', undefined);
      
      const mockProcess = {
        stdin: {
          setEncoding: vi.fn(),
          on: vi.fn()
        },
        versions: { node: '18.0.0' }
      };

      vi.stubGlobal('process', mockProcess);
      
      // Mock the stdin events
      const readStdinPromise = readStdin();
      
      // Simulate error event
      const errorCallback = mockProcess.stdin.on.mock.calls.find(call => call[0] === 'error')?.[1];
      
      if (errorCallback) {
        errorCallback(new Error('stdin error'));
      }
      
      await expect(readStdinPromise).rejects.toThrow('stdin error');
      
      vi.unstubAllGlobals();
    });
  });

  describe('exit', () => {
    it('should call Deno.exit when in Deno runtime', () => {
      const mockExit = vi.fn();
      vi.stubGlobal('Deno', { exit: mockExit });
      
      exit(42);
      expect(mockExit).toHaveBeenCalledWith(42);
      
      vi.unstubAllGlobals();
    });

    it('should call process.exit when in node/bun runtime', () => {
      vi.stubGlobal('Deno', undefined);
      const mockExit = vi.fn();
      vi.stubGlobal('process', {
        exit: mockExit,
        versions: { node: '18.0.0' }
      });
      
      exit(1);
      expect(mockExit).toHaveBeenCalledWith(1);
      
      vi.unstubAllGlobals();
    });

    it('should use default code 0 when none provided', () => {
      const mockExit = vi.fn();
      vi.stubGlobal('process', {
        exit: mockExit,
        versions: { node: '18.0.0' }
      });
      
      exit();
      expect(mockExit).toHaveBeenCalledWith(0);
      
      vi.unstubAllGlobals();
    });

    it('should handle missing Deno.exit', () => {
      vi.stubGlobal('Deno', {}); // Deno without exit
      
      // Should not throw
      expect(() => exit(0)).not.toThrow();
      
      vi.unstubAllGlobals();
    });

    it('should handle missing process.exit in node/bun', () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('process', { versions: { node: '18.0.0' } }); // process without exit
      
      // Should not throw
      expect(() => exit(0)).not.toThrow();
      
      vi.unstubAllGlobals();
    });

    it('should fallback to process.exit for unknown runtime', () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      
      const mockExit = vi.fn();
      vi.stubGlobal('process', { exit: mockExit });
      
      exit(5);
      expect(mockExit).toHaveBeenCalledWith(5);
      
      vi.unstubAllGlobals();
    });

    it('should handle completely unknown runtime without process', () => {
      vi.stubGlobal('Deno', undefined);
      vi.stubGlobal('Bun', undefined);
      vi.stubGlobal('process', undefined);
      
      // Should not throw
      expect(() => exit(0)).not.toThrow();
      
      vi.unstubAllGlobals();
    });
  });
});
