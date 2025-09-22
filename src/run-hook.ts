/**
 * Main hook runner following the reference implementation
 */

import type { HookHandlers } from './types/hook-handlers.js'
import type { HookPayload } from './types/hook-payloads.js'

// Logging utility
export function log(...args: unknown[]): void {
  console.log(`[${new Date().toISOString()}]`, ...args)
}

// Main hook runner
export function runHook(handlers: HookHandlers): void {
  const hook_type = process.argv[2]

  process.stdin.on('data', async (data: Buffer) => {
    try {
      const inputData = JSON.parse(data.toString())
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
          process.exit(0)
          return // Unreachable but satisfies linter

        case 'SubagentStop':
          if (handlers.subagentStop) {
            const response = await handlers.subagentStop(payload)
            console.log(JSON.stringify(response))
          } else {
            console.log(JSON.stringify({}))
          }
          process.exit(0)
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
  })
}