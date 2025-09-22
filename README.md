# claude-code-ts-hooks

**Cross-platform TypeScript types and utilities for Claude Code hooks** - Providing type safety and runtime validation for hook implementations across Node.js, Deno, and Bun.

[![npm version](https://badge.fury.io/js/claude-code-ts-hooks.svg)](https://badge.fury.io/js/claude-code-ts-hooks)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Deno](https://img.shields.io/badge/Deno-1.0+-blue.svg)](https://deno.land/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-orange.svg)](https://bun.sh/)

## Overview

This package provides comprehensive TypeScript support for [Claude Code](https://docs.claude.com/en/docs/claude-code/sdk/sdk-typescript.md) hooks with **cross-platform compatibility**, enabling developers to write type-safe hook implementations that work seamlessly across Node.js, Deno, and Bun runtimes. It includes:

- **Complete type definitions** for all Claude Code hook events
- **Cross-platform runtime detection** and compatibility layer
- **Runtime validation** using Zod schemas
- **Utility functions** for creating and managing hooks
- **Type guards** for runtime type checking
- **Helper functions** for common hook patterns
- **Zero-config usage** with Deno and Bun (no build step required)

## Installation & Usage

### Node.js (NPM/Yarn/PNPM)

```bash
npm install claude-code-ts-hooks
# or
yarn add claude-code-ts-hooks
# or
pnpm add claude-code-ts-hooks
```

**Requirements:**
- Node.js 18+ 
- TypeScript 5.0+ (for development)

### Deno

**No installation required!** Use directly from source:

```typescript
import { runHook, log, type HookHandlers } from 'https://deno.land/x/claude_code_ts_hooks/src/index.ts';
// or from your local copy
import { runHook, log, type HookHandlers } from './src/index.ts';
```

**Requirements:**
- Deno 1.0+
- Run with: `deno run --allow-read --allow-env your-hook.ts`

### Bun

**Use directly from source:**

```bash
bun run your-hook.ts
```

```typescript
import { runHook, log, type HookHandlers } from './src/index.ts';
```

**Requirements:**
- Bun 1.0+

## Quick Start

### Node.js Example

```typescript
import { runHook, log, type HookHandlers } from 'claude-code-ts-hooks';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    log(`About to use tool: ${payload.tool_name}`);
    
    // Block dangerous tools
    if (payload.tool_name === 'dangerous_tool') {
      return {
        decision: 'block',
        reason: 'Tool not allowed'
      };
    }
    
    return { decision: 'approve' };
  },

  stop: async (payload) => {
    log('🎉 Task completed!');
    return {};
  }
};

runHook(handlers);
```

### Deno Example

Create `hook.ts`:
```typescript
#!/usr/bin/env -S deno run --allow-read --allow-env

import { runHook, log, type HookHandlers } from './src/index.ts';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    log(`About to use tool: ${payload.tool_name}`);
    return { decision: 'approve' };
  },

  stop: async (payload) => {
    log('🎉 Task completed!');
    return {};
  }
};

runHook(handlers);
```

Run with:
```bash
deno run --allow-read --allow-env hook.ts
```

### Bun Example

Create `hook.ts`:
```typescript
#!/usr/bin/env bun

import { runHook, log, type HookHandlers } from './src/index.ts';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    log(`About to use tool: ${payload.tool_name}`);
    return { decision: 'approve' };
  },

  stop: async (payload) => {
    log('🎉 Task completed!');
    return {};
  }
};

runHook(handlers);
```

Run with:
```bash
bun run hook.ts
```

## Cross-Platform Features

### Runtime Detection

The library automatically detects the runtime environment and adapts accordingly:

```typescript
import { detectRuntime, getArgs, getEnv } from 'claude-code-ts-hooks';

const runtime = detectRuntime(); // 'node' | 'deno' | 'bun' | 'unknown'
const args = getArgs(); // Cross-platform command line arguments
const envVar = getEnv('MY_VAR'); // Cross-platform environment variable access
```

### Platform-Specific Examples

- **Node.js**: `examples/simple-hooks.ts` 
- **Deno**: `examples/simple-hooks-deno.ts`
- **Bun**: `examples/simple-hooks-bun.ts`

## Hook Types

### Supported Hook Events

| Hook Event | Description | Input Type | Output Type |
|------------|-------------|------------|-------------|
| `PreToolUse` | Before tool execution | `PreToolUseHookInput` | `PreToolUseHookOutput` |
| `PostToolUse` | After tool execution | `PostToolUseHookInput` | `PostToolUseHookOutput` |
| `Stop` | When Claude finishes | `StopHookInput` | `StopHookOutput` |
| `UserPromptSubmit` | When user submits prompt | `UserPromptSubmitHookInput` | `UserPromptSubmitHookOutput` |
| `Notification` | System notifications | `NotificationHookInput` | `NotificationHookOutput` |
| `SubagentStop` | When subagent stops | `SubagentStopHookInput` | `SubagentStopHookOutput` |
| `PreCompact` | Before compaction | `PreCompactHookInput` | `PreCompactHookOutput` |

### Hook Input Structure

All hook inputs extend `BaseHookInput`:

```typescript
interface BaseHookInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
}
```

Example `PreToolUseHookInput`:

```typescript
interface PreToolUseHookInput extends BaseHookInput {
  hook_event_name: 'PreToolUse';
  tool_name: string;
  tool_input: Record<string, unknown>;
}
```

### Hook Output Structure

All hook outputs extend `BaseHookOutput`:

```typescript
interface BaseHookOutput {
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
}
```

## Usage Examples

### 1. Creating Hook Handlers

```typescript
import { runHook, log, type HookHandlers } from 'claude-code-ts-hooks';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    log(`🔧 About to use tool: ${payload.tool_name}`);
    log(`📋 Tool parameters:`, payload.tool_input);
    
    return { decision: 'approve', reason: 'Tool usage approved' };
  },

  postToolUse: async (payload) => {
    log(`✅ Tool ${payload.tool_name} completed successfully`);
    return {};
  },

  stop: async (payload) => {
    log('🎉 Claude finished processing!');
    // You could play a sound, send a notification, etc.
    return {};
  },

  userPromptSubmit: async (payload) => {
    log(`👤 User submitted: ${payload.prompt.substring(0, 50)}...`);
    return { decision: 'approve' };
  }
};

runHook(handlers);
```

### 2. Hook with Conditional Logic

```typescript
import { runHook, type HookHandlers } from 'claude-code-ts-hooks';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    // Block dangerous tools
    const dangerousTools = ['rm', 'delete', 'format'];
    
    if (dangerousTools.some(tool => payload.tool_name.includes(tool))) {
      return {
        decision: 'block',
        reason: `Tool ${payload.tool_name} is not allowed`
      };
    }
    
    // Log tool usage for audit
    console.log(`📊 Audit: Tool ${payload.tool_name} used at ${new Date().toISOString()}`);
    
    return { decision: 'approve' };
  }
};

runHook(handlers);
```

### 3. Input Validation

```typescript
import { 
  validateHookInput, 
  type PreToolUsePayload 
} from 'claude-code-ts-hooks';

// Sample input
const sampleInput: PreToolUsePayload = {
  session_id: 'session-123',
  transcript_path: '/path/to/transcript',
  hook_type: 'PreToolUse',
  tool_name: 'write_file',
  tool_input: { path: './file.txt', content: 'Hello!' }
};

// General validation
const result = validateHookInput(sampleInput);
if (result.success) {
  console.log('Valid hook input:', result.data);
} else {
  console.error('Invalid input:', result.error);
}
```

### 4. Complete Example

```typescript
#!/usr/bin/env bun

import { runHook, log, type HookHandlers } from 'claude-code-ts-hooks';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    log(`🔧 About to use: ${payload.tool_name}`);
    
    // Safety check
    if (payload.tool_name.includes('rm')) {
      return { decision: 'block', reason: 'Dangerous command blocked' };
    }
    
    return { decision: 'approve' };
  },

  postToolUse: async (payload) => {
    log(`✅ Completed: ${payload.tool_name}`);
    return {};
  },

  stop: async (payload) => {
    log('🎉 All done!');
    return {};
  }
};

runHook(handlers);
```

### 5. Integration with Claude Code

The hooks are designed to work as standalone scripts that Claude Code calls:

```typescript
#!/usr/bin/env bun

import { runHook, type HookHandlers } from 'claude-code-ts-hooks';

const handlers: HookHandlers = {
  preToolUse: async (payload) => {
    // Your hook logic here
    console.log(`Tool: ${payload.tool_name}`);
    return { decision: 'approve' };
  }
};

runHook(handlers);
```

Save this as a `.ts` file and configure it in your Claude Code settings.

## API Reference

### Types

- **Input Types**: `PreToolUseHookInput`, `PostToolUseHookInput`, `StopHookInput`, etc.
- **Output Types**: `PreToolUseHookOutput`, `PostToolUseHookOutput`, `StopHookOutput`, etc.
- **Handler Types**: `HookHandler`, `HookHandlerFor`, `HookRegistry`
- **Utility Types**: `ToolInput`, `ToolResponse`, `HookEventName`, `HookConfig`

### Validation Functions

- `validateHookInput(input)` - Validate any hook input
- `validateHookOutput(output)` - Validate any hook output
- `parseHookInput(input, eventName)` - Parse and validate specific event input
- `safeParseJSON(jsonString)` - Safely parse JSON with validation

### Type Guards

- `isHookInputOfType(input, eventName)` - Generic type guard
- `isPreToolUseInput(input)` - Specific type guards for each event
- `isHookEventName(value)` - Check if value is valid event name

### Helper Functions

- `createHookHandler(eventName, handler)` - Create type-safe handler
- `createHookRegistry(handlers)` - Create handler registry
- `executeHook(handler, input, context)` - Execute with error handling
- `withLogging(handler, logger)` - Add logging to handler
- `withTimeout(handler, timeout)` - Add timeout to handler
- `createHookOutput.success()` - Create success output
- `createHookOutput.block(reason)` - Create blocking output

## TypeScript Configuration

This package is built with TypeScript 5.0+ and uses modern features. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## Distribution & Publishing

This package is designed to work seamlessly across different JavaScript runtimes:

### NPM Registry (Node.js)

Published to NPM for Node.js users:
```bash
npm install claude-code-ts-hooks
```

### JSR (Deno)

The package can be published to JSR (JavaScript Registry) for Deno:
```bash
# Publish to JSR
deno publish
```

Deno users can import directly:
```typescript
import { runHook } from "jsr:@lucacri/claude-code-ts-hooks";
```

### Direct Source Usage

For maximum compatibility, users can clone this repository and import directly from source:

```bash
git clone https://github.com/lucacri/claude-code-ts-hooks.git
cd claude-code-ts-hooks
```

Then import from source:
```typescript
// Deno
import { runHook } from "./src/index.ts";

// Bun  
import { runHook } from "./src/index.ts";

// Node.js (with TypeScript)
import { runHook } from "./src/index.ts";
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Related

- [Claude Code SDK](https://docs.claude.com/en/docs/claude-code/sdk/sdk-typescript.md) - Official Claude Code TypeScript SDK
- [Zod](https://zod.dev/) - TypeScript-first schema validation library

---

Made with ❤️ for the Claude Code community
