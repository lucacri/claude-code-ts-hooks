import { expect, vi } from 'vitest';

// Initialize Vitest's internal state
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor}-${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor}-${ceiling}`,
        pass: false,
      };
    }
  },
});

// Cross-platform compatibility layer for test runners
declare global {
  var viCompat: typeof vi;
}

// Create compatibility layer for Bun and other test runners
if (typeof vi === 'undefined') {
  // Mock implementation for non-Vitest environments (like Bun)
  (globalThis as any).vi = {
    fn: (impl?: any) => {
      const mockFn = jest?.fn?.(impl) || ((impl || (() => {})) as any);
      mockFn.mockImplementation = mockFn.mockImplementation || ((fn: any) => { mockFn._impl = fn; return mockFn; });
      mockFn.mockRestore = mockFn.mockRestore || (() => {});
      mockFn.mockReset = mockFn.mockReset || (() => {});
      return mockFn;
    },
    spyOn: (obj: any, method: string) => {
      const original = obj[method];
      const spy = {
        mockImplementation: (impl: any) => { obj[method] = impl; return spy; },
        mockRestore: () => { obj[method] = original; },
        mockReset: () => {}
      } as any;
      return spy;
    },
    clearAllMocks: () => {},
    resetAllMocks: () => {},
    restoreAllMocks: () => {},
    // Timer compatibility - no-op implementations for Bun
    useFakeTimers: () => {},
    useRealTimers: () => {},
    setSystemTime: (date: Date) => {},
    // Globals compatibility - no-op implementations for Bun
    unstubAllGlobals: () => {},
    stubGlobal: (name: string, value: any) => {},
    // Mock modules
    mock: (path: string, factory?: any) => {},
    doMock: (path: string, factory?: any) => {},
    unmock: (path: string) => {},
    doUnmock: (path: string) => {}
  };
} else {
  // Extend existing vi object with compatibility methods if needed
  if (!vi.unstubAllGlobals) {
    (vi as any).unstubAllGlobals = () => {};
  }
  if (!vi.useFakeTimers) {
    (vi as any).useFakeTimers = () => {};
  }
  if (!vi.useRealTimers) {
    (vi as any).useRealTimers = () => {};
  }
  if (!vi.setSystemTime) {
    (vi as any).setSystemTime = (date: Date) => {};
  }
}

// Ensure compatibility object is available globally
globalThis.viCompat = (globalThis as any).vi;

// Ensure Vitest's internal state is properly initialized
(globalThis as any).__VITEST_GLOBAL_SETUP__ = true;
