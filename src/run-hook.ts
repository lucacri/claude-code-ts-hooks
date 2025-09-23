/**
 * Main hook runner following the reference implementation
 * Cross-platform compatible with Node.js, Deno, and Bun
 */

import type { HookHandlers } from './types/hook-handlers.js'
import type { HookPayload } from './types/hook-payloads.js'
import { getArgs, readStdin, exit, detectRuntime } from './utils/runtime.js'

// Logging utility
export function log(...args: unknown[]): void {
  console.log(`[${new Date().toISOString()}]`, ...args)
}

// Main hook runner - preserved existing Node.js behavior for compatibility
export function runHook(handlers: HookHandlers): void {
  // Try to get hook_type from command line arguments
  let hook_type: string
  
  // Use process.argv directly if available (Node.js), fallback to cross-platform
  if (typeof process !== 'undefined' && process.argv) {
    hook_type = process.argv[2] || ''
  } else {
    const args = getArgs()
    hook_type = args[0] || ''
  }

  const runtime = detectRuntime()

  // For Deno and Bun, we need to handle stdin differently
  if (runtime === 'deno' || runtime === 'bun') {
    handleStdinAsync(hook_type, handlers)
  } else {
    // Node.js traditional event-based approach - maintain compatibility
    if (typeof process !== 'undefined' && process.stdin) {
      process.stdin.on('data', async (data: Buffer) => {
        await processHook(data.toString(), hook_type, handlers)
      })
    }
  }
}

/**
 * Handle stdin asynchronously for Deno and Bun
 */
async function handleStdinAsync(hook_type: string, handlers: HookHandlers): Promise<void> {
  try {
    const data = await readStdin()
    await processHook(data, hook_type, handlers)
  } catch (error) {
    console.error('Hook error:', error)
    console.log(JSON.stringify({action: 'continue'}))
  }
}

/**
 * Process hook data (shared between Node.js and Deno/Bun approaches)
 */
async function processHook(data: string, hook_type: string, handlers: HookHandlers): Promise<void> {
  try {
    const inputData = JSON.parse(data)
    // Add hook_type for internal processing (not part of official input schema)
    const payload: HookPayload = {
      ...inputData,
      hook_type: hook_type as HookPayload['hook_type'],
    }

    switch (payload.hook_type) {
        case 'PreToolUse':
          if (handlers.preToolUse) {
            const response = await handlers.preToolUse(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          break

        case 'PostToolUse':
          if (handlers.postToolUse) {
            const response = await handlers.postToolUse(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          break

        case 'Notification':
          if (handlers.notification) {
            const response = await handlers.notification(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          break

        case 'Stop':
          if (handlers.stop) {
            const response = await handlers.stop(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          // Use cross-platform exit, but prefer direct process.exit for Node.js in tests
          if (typeof process !== 'undefined' && process.exit) {
            process.exit(0)
          } else {
            exit(0)
          }
          return // Unreachable but satisfies linter

        case 'SubagentStop':
          if (handlers.subagentStop) {
            const response = await handlers.subagentStop(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          // Use cross-platform exit, but prefer direct process.exit for Node.js in tests
          if (typeof process !== 'undefined' && process.exit) {
            process.exit(0)
          } else {
            exit(0)
          }
          return // Unreachable but satisfies linter

        case 'UserPromptSubmit':
          if (handlers.userPromptSubmit) {
            const response = await handlers.userPromptSubmit(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          break

        case 'PreCompact':
          if (handlers.preCompact) {
            const response = await handlers.preCompact(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          break

        case 'SessionStart':
          if (handlers.sessionStart) {
            const response = await handlers.sessionStart(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          break

    default:
      console.log(JSON.stringify({}))
  }
  } catch (error) {
    console.error('Hook error:', error)
    console.log(JSON.stringify({action: 'continue'}))
  }
}