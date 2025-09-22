/**
 * Cross-platform runtime detection and utilities
 * Provides compatibility layer for Node.js, Deno, and Bun
 */

export type Runtime = 'node' | 'deno' | 'bun' | 'unknown';

/**
 * Detect the current JavaScript runtime
 */
export function detectRuntime(): Runtime {
  // Check for Deno
  if (typeof (globalThis as any).Deno !== 'undefined') {
    return 'deno';
  }
  
  // Check for Bun
  if (typeof (globalThis as any).Bun !== 'undefined') {
    return 'bun';
  }
  
  // Check for Node.js  
  if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process.versions?.node) {
    return 'node';
  }
  
  return 'unknown';
}

/**
 * Get command line arguments in a cross-platform way
 */
export function getArgs(): string[] {
  const runtime = detectRuntime();
  
  switch (runtime) {
    case 'deno':
      return (globalThis as any).Deno?.args || [];
    case 'bun':
    case 'node':
      return (globalThis as any).process?.argv?.slice(2) || [];
    default:
      return [];
  }
}

/**
 * Read from stdin in a cross-platform way
 */
export async function readStdin(): Promise<string> {
  const runtime = detectRuntime();
  
  switch (runtime) {
    case 'deno': {
      const chunks: Uint8Array[] = [];
      const reader = (globalThis as any).Deno?.stdin?.readable?.getReader();
      
      if (!reader) {
        throw new Error('Deno stdin not available');
      }
      
      try {
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
      const proc = (globalThis as any).process;
      if (!proc) {
        throw new Error('Process not available');
      }
      
      return new Promise((resolve, reject) => {
        let data = '';
        proc.stdin.setEncoding('utf8');
        
        proc.stdin.on('data', (chunk: string) => {
          data += chunk;
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
  
  switch (runtime) {
    case 'deno':
      if ((globalThis as any).Deno?.exit) {
        (globalThis as any).Deno.exit(code);
      }
      break;
    case 'bun':
    case 'node':
      if ((globalThis as any).process?.exit) {
        (globalThis as any).process.exit(code);
      }
      break;
    default:
      // Fallback for unknown runtimes
      if (typeof (globalThis as any).process?.exit === 'function') {
        (globalThis as any).process.exit(code);
      }
      break;
  }
}

/**
 * Cross-platform environment variable access
 */
export function getEnv(key: string): string | undefined {
  const runtime = detectRuntime();
  
  switch (runtime) {
    case 'deno':
      return (globalThis as any).Deno?.env?.get(key);
    case 'bun':
    case 'node':
      return (globalThis as any).process?.env?.[key];
    default:
      return undefined;
  }
}