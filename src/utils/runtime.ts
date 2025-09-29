/**
 * Cross-platform runtime detection and utilities
 * Provides compatibility layer for Node.js, Deno, and Bun
 */

type BufferCtor = typeof import('node:buffer').Buffer;

// Type declarations for runtime globals
// Buffer is surfaced via Node, Bun, or Deno's bare Node builtins flag
interface GlobalThisWithRuntimes {
  Deno?: {
    args: string[];
    stdin: {
      readable: {
        getReader(): ReadableStreamDefaultReader<Uint8Array>;
      };
    };
    exit(code?: number): never;
    env: {
      get(key: string): string | undefined;
    };
  };
  Bun?: unknown;
  process?: {
    argv: string[];
    stdin: {
      on(event: string, listener: (data: BufferCtor) => void): void;
      setEncoding(encoding: string): void;
    };
    exit(code?: number): never;
    env: Record<string, string | undefined>;
    version?: string;
    platform?: string;
    arch?: string;
    versions?: {
      node: string;
    };
  };
}

export type Runtime = 'node' | 'deno' | 'bun' | 'unknown';

/**
 * Detect the current JavaScript runtime
 */
export function detectRuntime(): Runtime {
  const global = globalThis as GlobalThisWithRuntimes;
  
  // Check for Deno
  if (typeof global.Deno !== 'undefined') {
    return 'deno';
  }
  
  // Check for Bun
  if (typeof global.Bun !== 'undefined') {
    return 'bun';
  }
  
  // Check for Node.js  
  if (typeof global.process !== 'undefined' && global.process.versions?.node) {
    return 'node';
  }
  
  return 'unknown';
}

/**
 * Get command line arguments in a cross-platform way
 */
export function getArgs(): string[] {
  const runtime = detectRuntime();
  const global = globalThis as GlobalThisWithRuntimes;
  
  switch (runtime) {
    case 'deno':
      return global.Deno?.args || [];
    case 'bun':
    case 'node':
      return global.process?.argv?.slice(2) || [];
    default:
      return [];
  }
}

/**
 * Read from stdin in a cross-platform way
 */
export async function readStdin(): Promise<string> {
  const runtime = detectRuntime();
  const global = globalThis as GlobalThisWithRuntimes;
  
  switch (runtime) {
    case 'deno': {
      const chunks: Uint8Array[] = [];
      const reader = global.Deno?.stdin?.readable?.getReader();
      
      if (!reader) {
        throw new Error('Deno stdin not available');
      }
      
      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }
      
      // Concatenate all chunks
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      
      return new TextDecoder().decode(result);
    }
    
    case 'bun':
    case 'node': {
      const proc = global.process;
      if (!proc) {
        throw new Error('Process not available');
      }
      
      return new Promise((resolve, reject) => {
        let data = '';
        proc.stdin.setEncoding('utf8');
        
        proc.stdin.on('data', (chunk: any) => {
          const text = chunk instanceof Uint8Array ? new TextDecoder().decode(chunk) : String(chunk)
          data += text;
        });
        
        proc.stdin.on('end', () => {
          resolve(data.trim());
        });
        
        proc.stdin.on('error', reject);
      });
    }
    
    default:
      throw new Error('Unsupported runtime for stdin reading');
  }
}

/**
 * Exit the process in a cross-platform way
 */
export function exit(code: number = 0): void {
  const runtime = detectRuntime();
  const global = globalThis as GlobalThisWithRuntimes;
  
  switch (runtime) {
    case 'deno':
      if (global.Deno?.exit) {
        global.Deno.exit(code);
      }
      break;
    case 'bun':
    case 'node':
      if (global.process?.exit) {
        global.process.exit(code);
      }
      break;
    default:
      // Fallback for unknown runtimes
      if (global.process?.exit && typeof global.process.exit === 'function') {
        global.process.exit(code);
      }
      break;
  }
}

/**
 * Cross-platform environment variable access
 */
export function getEnv(key: string): string | undefined {
  const runtime = detectRuntime();
  const global = globalThis as GlobalThisWithRuntimes;

  switch (runtime) {
    case 'deno':
      return global.Deno?.env?.get(key);
    case 'bun':
    case 'node':
      return global.process?.env?.[key];
    default:
      return undefined;
  }
}

/**
 * Runtime information interface
 */
export interface RuntimeInfo {
  runtime: Runtime;
  version?: string;
  platform?: string;
  arch?: string;
  nodeVersion?: string;
  hasBuffer: boolean;
  supportsStdin: boolean;
  supportsEnvVars: boolean;
}

/**
 * Get comprehensive runtime information for debugging and diagnostics
 */
export function getRuntimeInfo(): RuntimeInfo {
  const runtime = detectRuntime();
  const global = globalThis as GlobalThisWithRuntimes;

  const info: RuntimeInfo = {
    runtime,
    hasBuffer: typeof (globalThis as any).Buffer !== 'undefined',
    supportsStdin: false,
    supportsEnvVars: false,
  };

  switch (runtime) {
    case 'deno':
      info.version = (global.Deno as any)?.version?.deno;
      info.platform = (global.Deno as any)?.build?.os;
      info.arch = (global.Deno as any)?.build?.arch;
      info.supportsStdin = !!(global.Deno?.stdin?.readable);
      info.supportsEnvVars = !!(global.Deno?.env);
      break;

    case 'bun':
      info.version = (global.Bun as any)?.version;
      info.platform = global.process?.platform;
      info.arch = global.process?.arch;
      info.supportsStdin = !!(global.process?.stdin);
      info.supportsEnvVars = !!(global.process?.env);
      break;

    case 'node':
      info.version = global.process?.version;
      info.nodeVersion = global.process?.versions?.node;
      info.platform = global.process?.platform;
      info.arch = global.process?.arch;
      info.supportsStdin = !!(global.process?.stdin);
      info.supportsEnvVars = !!(global.process?.env);
      break;

    default:
      // For unknown runtimes, try to detect basic capabilities
      info.supportsStdin = !!(global.process?.stdin);
      info.supportsEnvVars = !!(global.process?.env || global.Deno?.env);
      break;
  }

  return info;
}
